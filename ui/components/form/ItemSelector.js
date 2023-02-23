import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example({items, indexKey, displayKey, modelName, selected, setSelected}) {
  return (
    <Listbox value={selected} onChange={setSelected} disabled={!items || items.length == 0}>
      {({ open, disabled }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-zinc-700 dark:text-zinc-50 ml-2">{modelName}</Listbox.Label>
          <div className="relative mt-1 text-zinc-900 dark:text-zinc-900">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-zinc-300 bg-white dark:bg-zinc-100 py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:dark:ring-white">
              <span className="inline-flex w-full truncate">
                {disabled
                  ? <span className="truncate text-zinc-400">No {modelName}s</span>
                  : !selected
                    ? <span className="truncate text-zinc-600">Select {modelName}</span>
                    : <>
                        <span className="font-medium">{selected && selected[displayKey]}</span>
                        <span className="ml-2 truncate text-zinc-600">{selected && selected[indexKey]}</span>
                      </>
                }
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-zinc-100 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {items && items.map((person) => (
                  <Listbox.Option
                    key={person[indexKey]}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-zinc-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex">
                          <span className={classNames(selected ? 'font-semibold' : 'font-medium', 'whitespace-nowrap')}>
                            {person[displayKey]}
                          </span>
                          <span className={classNames(active ? 'text-white' : 'text-zinc-600', 'ml-2 truncate')}>
                            {person[indexKey]}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
