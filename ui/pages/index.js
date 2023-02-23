// @refresh reset
import {useCallback} from 'react'
import Layout, {Row, Main, Container, Well} from 'components/layouts/WideStretched'
import Header from 'components/headers/Underline'
import Footer from 'components/footers/SocialOnly'
import ItemSelector from 'components/form/ItemSelector'
import {useUrbitStore} from 'components/useUrbitStore'
import {ArrowPathIcon, ChatBubbleOvalLeftIcon} from '@heroicons/react/24/outline'
import {InformationCircleIcon, ArrowRightIcon} from '@heroicons/react/20/solid'
import {dateToDa} from '@urbit/api'

function LoadingHeader({content, loading}) {
  return (
    <div className='flex flex-row mb-2 sm:mb-4 items-baseline justify-between'>
      <h2 className='text-2xl font-medium uppercase mr-8'>{content}</h2>
      {loading && <span className='text-medium font-medium text-zinc-500 dark:text-zinc-300'>
        <span>Loading</span>
        <span><ArrowPathIcon className="inline h-4 w-4 align-middle mb-1 ml-1 animate-spin" /></span>
      </span>}
    </div>
  )
}

function InfoBox({children}) {
  return (
    <div className="rounded-md bg-blue-50 dark:bg-blue-700 p-4 border-[1px] border-blue-100 dark:border-0 mb-2 lg:mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 dark:text-blue-50" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700 dark:text-white">{children}</p>
        </div>
      </div>
    </div>
  )
}

function NotesStackedList({notes, noteAction}) {
  const quipCount = useCallback((note) => {
    return Object.entries(note.seal.quips).length
  }, [])

  return (
    <div className="overflow-hidden bg-white dark:bg-zinc-600 shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-zinc-200 dark:divide-zinc-700">
        {Object.entries(notes).sort(([a,], [b,]) => a.localeCompare(b)).map(([time, note]) => (
          <li key={time}>
            <div className="block hover:bg-zinc-50 dark:hover:bg-zinc-700">
              <div className="flex items-center px-4 py-2 sm:px-6">
                <div className="min-w-0 flex-1 flex items-center justify-start">
                  <div className="truncate flex-1">
                    <div className="flex text-sm">
                      <p className="truncate font-medium text-indigo-600 dark:text-indigo-200">{note.essay.title}</p>
                      <p className="ml-1 flex-shrink-0 font-normal text-zinc-500 dark:text-zinc-200">by {note.essay.author}</p>
                    </div>
                    <div className="mt-1 flex">
                      <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-100">
                        <p>
                          <time dateTime={note.essay.sent}>{dateToDa(new Date(note.essay.sent))}</time>
                        </p>
                      </div>
                    </div>
                  </div>
                  {!!quipCount(note) &&
                    <div className="mt-1 flex-shrink-0 sm:mt-0 sm:ml-5">
                      <div className="flex space-x-1 overflow-hidden text-zinc-500 dark:text-zinc-100">
                        <span className=''>{quipCount(note)}</span>
                        <ChatBubbleOvalLeftIcon className="mr-1.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      </div>
                    </div>
                  }
                </div>
                {noteAction &&
                  <div className="ml-5 flex-shrink-0">
                    <button type="button" onClick={() => noteAction(time, note)} className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 dark:bg-indigo-300 px-2 py-2 text-sm font-medium text-white dark:text-zinc-900 shadow-sm hover:bg-indigo-700 hover:dark:bg-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-300 focus:ring-offset-1 dark:ring-offset-zinc-600" >
                      <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                }
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Index() {
  const {
    groups,
    srcChannels,
    srcNotes,
    destChannels,
    destNotes,
    srcLoading,
    srcGroup,
    setSrcGroup,
    srcChannel,
    setSrcChannel,
    destLoading,
    destGroup,
    setDestGroup,
    destChannel,
    setDestChannel,
    migrateNote,
  } = useUrbitStore()

  return (
    <Layout className="bg-zinc-50 text-zinc-800 dark:bg-zinc-800 dark:text-white transition-colors duration-200">
      <Row>
        <Container>
          <Header />
        </Container>
      </Row>
      <Main className="flex flex-col">
        <Container className="flex flex-col flex-1">
          <div className='flex flex-col flex-1 sm:flex-row min-h-full w-full gap-x-4 gap-y-2 mt-2 sm:mt-4 mb-4 sm:mb-8'>
            <Well className="grow">
              <LoadingHeader content="Source" loading={srcLoading} />
              <div className='flex flex-col xl:flex-row gap-x-2 gap-y-2 mb-2 lg:mb-4'>
                <div className='grow xl:max-w-[49.5%]'>
                  <ItemSelector indexKey="flag" displayKey="title" modelName="Group"
                    items={groups} selected={srcGroup} setSelected={setSrcGroup} />
                </div>
                <div className='grow xl:max-w-[49.5%]'>
                  <ItemSelector indexKey="flag" displayKey="title" modelName="Channel"
                    items={srcChannels} selected={srcChannel} setSelected={setSrcChannel} />
                </div>
              </div>
              {srcChannel && !srcChannel.flag.startsWith("diary") &&
                <InfoBox>Chat and Links channels are not supported at this time. Please select a diary.</InfoBox>
              }
              <NotesStackedList notes={srcNotes} noteAction={migrateNote} />
            </Well>
            <Well className="grow">
              <LoadingHeader content="Destination" loading={destLoading} />
              <div className='flex flex-col xl:flex-row gap-x-2 gap-y-2 mb-2 lg:mb-4'>
                <div className='grow xl:max-w-[49.5%]'>
                  <ItemSelector indexKey="flag" displayKey="title" modelName="Group"
                    items={groups} selected={destGroup} setSelected={setDestGroup} />
                </div>
                <div className='grow xl:max-w-[49.5%]'>
                  <ItemSelector indexKey="flag" displayKey="title" modelName="Channel"
                    items={destChannels} selected={destChannel} setSelected={setDestChannel} />
                </div>
              </div>
              {destChannel && !destChannel.flag.startsWith("diary") &&
                <InfoBox>Chat and Links channels are not supported at this time. Please select a diary.</InfoBox>
              }
              <NotesStackedList notes={destNotes} />
            </Well>
          </div>
        </Container>
      </Main>
      <Row className="border-t border-zinc-300 bg-zinc-200 text-zinc-600">
        <Container>
          <Footer />
        </Container>
      </Row>
    </Layout>
  )
}
