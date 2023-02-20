import {useEffect, useCallback, useState} from 'react'
import Layout, {Row, Main, Container} from 'components/layouts/WideStretched'
import Header from 'components/headers/Underline'
import Footer from 'components/footers/SocialOnly'
import {useUrbit} from 'components/useUrbit'

export default function Index() {
  const urbit = useUrbit()
  const [notesJson, setNotesJson] = useState("")

  const doPoke = useCallback(async () => {
    await urbit.poke({
      app: "hood",
      mark: "helm-hi",
      json: "index page poke"
    })
  }, [urbit])

  const scryGroups = useCallback(async () => {
    const info = await urbit.scry({
      app: "groups",
      path: "/groups"
    })
    console.log(info)
  }, [urbit])

  const scryDiaries = useCallback(async () => {
    const info = await urbit.scry({
      app: "diary",
      path: "/shelf"
    })
    console.log(info)
  }, [urbit])

  const scryNotes = useCallback(async () => {
    const info = await urbit.scry({
      app: "diary",
      path: "/diary/~nec/notes-for-all/notes/newest/10/note"
    })
    setNotesJson(info)
    console.log(info)
  }, [urbit])

  const addNote = useCallback(async (flag, time, essay) => {
    const obj = {
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
    }
    // console.log(obj)
    // console.log(JSON.stringify(obj))
    const pok = await urbit.poke(obj)
    console.log(pok)
  }, [urbit])

  const addQuip = useCallback(async (flag, noteTime, time, memo) => {
    const obj = {
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
    }
    // console.log(obj)
    // console.log(JSON.stringify(obj))
    const pok = await urbit.poke(obj)
    // console.log(pok)
  }, [urbit])

  const copyNote = useCallback(async () => {
    const theFlag = "~nec/notes-for-all"
    const firstDate = Object.keys(notesJson).sort()[0]
    console.log(firstDate)
    const theNote = notesJson[firstDate]
    console.log(theNote)
    await addNote(theFlag, firstDate, theNote.essay)
    for (const [quipDate, quip] of Object.entries(theNote.seal.quips)) {
      console.log(quipDate, quip)
      await addQuip(theFlag, oops, quipDate, quip.memo)
    }
  }, [notesJson, addNote])

  return (
    <Layout className="bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-white transition-colors duration-200">
      <Row>
        <Container>
          <Header />
        </Container>
      </Row>
      <Main>
        <Container>
          <div className="px-4 py-6 sm:px-0">
            <div className="p-12 flex flex-row justify-around">
              <div className="flex flex-col">

                <button type="button" onClick={() => scryGroups()} className="flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-2">
                  Scry groups
                </button>
                <button type="button" onClick={() => scryDiaries()} className="flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-2">
                  Scry diaries
                </button>
                <button type="button" onClick={() => scryNotes()} className="flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-2">
                  Scry notes
                </button>
                <button type="button" onClick={() => copyNote()} className="flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-2">
                  Post note
                </button>
              </div>
              <div>
                <textarea id="" name="" cols="50" rows="100" value={JSON.stringify(notesJson)} readOnly />
              </div>
            </div>
          </div>
        </Container>
      </Main>
      <Row className="border-t border-gray-300 bg-gray-200 text-gray-600">
        <Container>
          <Footer />
        </Container>
      </Row>
    </Layout>
  )
}
