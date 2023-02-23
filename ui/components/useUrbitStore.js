// @refresh reset
import {useCallback, useReducer, useEffect} from 'react'
import {useUrbit} from 'components/useUrbit'

const initialState = {
  groups: [],
  srcChannels: [],
  srcNotes: {},
  destChannels: [],
  destNotes: {},
  srcGroup: null,
  srcChannel: null,
  srcLoading: false,
  destGroup: null,
  destChannel: null,
  destLoading: false,
}

function reducer(state, action) {
  switch (action.type) {
    case "set_state_field":
      return {...state, [action.field]: action.value}
    case "set_src_group":
      return {
        ...state,
        srcGroup: action.group,
        srcChannels: action.group.channels,
        srcChannel: null,
        srcNotes: {},
      }
    case "set_dest_group":
      return {
        ...state,
        destGroup: action.group,
        destChannels: action.group.channels,
        destChannel: null,
        destNotes: {},
      }
    case "fullGroups":
      const groups = Object.entries(action.groups).map(([flag, group]) => ({
        flag,
        title: group.meta.title,
        channels: Object.entries(group.channels).map(([flag, channel]) => ({
          flag,
          title: channel.meta.title,
        })),
      }))
      return {
        ...initialState,
        groups,
      }
    default:
      return state
  }
}

export function useUrbitStore() {
  const urbit = useUrbit()
  const [state, dispatch] = useReducer(reducer, initialState)

  const setStateField = useCallback((field, value) => {dispatch({ type: "set_state_field", field, value })}, [])
  const setSrcGroup = useCallback((group) => dispatch({type: "set_src_group", group}), [])
  const setDestGroup = useCallback((group) => dispatch({type: "set_dest_group", group}), [])
  const setSrcChannel = useCallback((channel) => setStateField("srcChannel", channel), [setStateField])
  const setDestChannel = useCallback((channel) => setStateField("destChannel", channel), [setStateField])

  const fetchGroups = useCallback(async () => {
    return await urbit.scry({
      app: "groups",
      path: "/groups"
    })
  }, [urbit])

  const fetchNotes = useCallback(async (channelFlag) => {
    return await urbit.scry({
      app: "diary",
      path: `/${channelFlag}/notes/newest/999/note`
    })
  }, [urbit])

  const fetchNote = useCallback(async (channelFlag, time) => {
    return await urbit.scry({
      app: "diary",
      path: `/${channelFlag}/notes/note/${time}`
    })
  }, [urbit])

  const addNote = useCallback(async (flag, time, essay) => {
    return await urbit.poke({
      app: 'diary',
      mark: 'diary-action-0',
      json: {
        flag,
        update: {
          time: '',
          diff: {
            notes: {
              time,
              delta: {
                add: essay
              },
            },
          }
        },
      },
    })
  }, [urbit])

  const addQuip = useCallback(async (flag, noteTime, time, memo) => {
    return await urbit.poke({
      app: 'diary',
      mark: 'diary-action-0',
      json: {
        flag,
        update: {
          time: '',
          diff: {
            notes: {
              time: noteTime,
              delta: {
                quips: {
                  time,
                  delta: {
                    add: memo,
                  },
                },
              },
            },
          },
        },
      },
    })
  }, [urbit])

  const loadGroups = useCallback(async () => {
    if (urbit) {
      setStateField("srcLoading", true)
      setStateField("destLoading", true)
      const groups = await fetchGroups()
      dispatch({type: "fullGroups", groups})
      setStateField("srcLoading", false)
      setStateField("destLoading", false)
    }
  }, [urbit, setStateField, fetchGroups])

  const loadNotes = useCallback(async (prefix, flag) => {
    setStateField(`${prefix}Notes`, {})
    if (urbit && flag && flag.startsWith("diary")) {
      setStateField(`${prefix}Loading`, true)
      const notes = await fetchNotes(flag)
      setStateField(`${prefix}Notes`, notes)
      setStateField(`${prefix}Loading`, false)
    }
  }, [urbit, fetchNotes, setStateField])

  // Load groups for the app once
  useEffect(() => {
    loadGroups()
  }, [loadGroups])

  useEffect(() => {
    loadNotes("src", state.srcChannel?.flag)
  }, [loadNotes, state.srcChannel])

  useEffect(() => {
    loadNotes("dest", state.destChannel?.flag)
  }, [loadNotes, state.destChannel])

  const migrateNote = useCallback(async (time, note) => {
    if (!state.destChannel?.flag.startsWith("diary/")) {
      console.error("Destination diary required")
      return
    }

    // assumes diary every time, remove leading "diary/"
    const trimFlag = state.destChannel.flag.substr(6)

    setStateField("destLoading", true)
    const noteSubscription = urbit.subscribeOnce('diary', `/diary/${trimFlag}/ui`)

    await addNote(trimFlag, time, note.essay)

    const newNoteEvent = await noteSubscription

    for (const [quipDate, quip] of Object.entries(note.seal.quips)) {
      await addQuip(trimFlag, newNoteEvent.time, quipDate, quip.memo)
    }

    const newNote = await fetchNote(state.destChannel.flag, newNoteEvent.time)
    console.log("newNote", newNote)

    setStateField("destNotes", {
      ...state.destNotes,
      [newNoteEvent.time]: newNote,
    })

    setStateField("destLoading", false)
  }, [urbit, addNote, addQuip, fetchNote, setStateField, state.destChannel, state.destNotes])

  useEffect(() => {
    console.log("state change", state)
  }, [state])

  return {
    groups: state.groups,
    srcChannels: state.srcChannels,
    srcNotes: state.srcNotes,
    destChannels: state.destChannels,
    destNotes: state.destNotes,
    srcLoading: state.srcLoading,
    srcGroup: state.srcGroup,
    setSrcGroup,
    srcChannel: state.srcChannel,
    setSrcChannel,
    destLoading: state.destLoading,
    destGroup: state.destGroup,
    setDestGroup,
    destChannel: state.destChannel,
    setDestChannel,
    migrateNote,
  }
}
