"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Scrabble letter point values
const LETTER_VALUES: { [key: string]: number } = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10,
}

// Curated list of common Scrabble-valid English words
const SCRABBLE_WORDS = [
  // 3-letter words
  "cat",
  "dog",
  "run",
  "sun",
  "fun",
  "car",
  "bar",
  "far",
  "jar",
  "tar",
  "bat",
  "hat",
  "mat",
  "rat",
  "sat",
  "fat",
  "pat",
  "vat",
  "eat",
  "tea",
  "sea",
  "pea",
  "bee",
  "see",
  "fee",
  "key",
  "day",
  "way",
  "say",
  "may",
  "bay",
  "lay",
  "pay",
  "ray",
  "joy",
  "boy",
  "toy",
  "try",
  "dry",
  "cry",
  "fly",
  "sky",
  "spy",
  "buy",
  "guy",
  "cut",
  "but",
  "put",
  "nut",
  "gut",
  "hut",
  "jut",
  "rut",
  "shut",
  "hot",
  "pot",
  "lot",
  "got",
  "not",
  "dot",
  "cot",
  "rot",
  "bot",
  "top",
  "hop",
  "pop",
  "cop",
  "mop",
  "sop",
  "chop",
  "big",
  "dig",
  "fig",
  "jig",
  "pig",
  "rig",
  "wig",
  "bag",
  "tag",
  "rag",
  "lag",
  "sag",
  "wag",
  "leg",
  "beg",
  "peg",
  "keg",
  "egg",
  "log",
  "dog",
  "fog",
  "hog",
  "jog",
  "cog",
  "bug",
  "dug",
  "hug",
  "jug",
  "mug",
  "rug",
  "tug",
  "lug",
  "pug",
  "red",
  "bed",
  "fed",
  "led",
  "wed",
  "shed",
  "sled",
  "bred",
  "dread",
  "thread",
  "head",
  "read",
  "dead",
  "lead",
  "bread",

  // 4-letter words
  "word",
  "work",
  "walk",
  "talk",
  "back",
  "pack",
  "rack",
  "sack",
  "tack",
  "lack",
  "jack",
  "hack",
  "duck",
  "luck",
  "muck",
  "puck",
  "suck",
  "tuck",
  "buck",
  "rock",
  "lock",
  "sock",
  "dock",
  "mock",
  "cock",
  "pock",
  "hock",
  "book",
  "look",
  "took",
  "cook",
  "hook",
  "nook",
  "rook",
  "shook",
  "brook",
  "crook",
  "spook",
  "snook",
  "make",
  "take",
  "wake",
  "bake",
  "cake",
  "fake",
  "lake",
  "rake",
  "sake",
  "snake",
  "brake",
  "shake",
  "stake",
  "flake",
  "quake",
  "like",
  "bike",
  "hike",
  "mike",
  "pike",
  "spike",
  "strike",
  "joke",
  "poke",
  "yoke",
  "broke",
  "smoke",
  "spoke",
  "stroke",
  "choke",
  "home",
  "come",
  "some",
  "dome",
  "rome",
  "tome",
  "chrome",
  "gnome",
  "game",
  "name",
  "same",
  "tame",
  "fame",
  "lame",
  "blame",
  "shame",
  "flame",
  "frame",
  "claim",
  "aim",
  "maim",
  "time",
  "lime",
  "dime",
  "mime",
  "chime",
  "prime",
  "crime",
  "grime",
  "slime",
  "rhyme",
  "thyme",
  "climb",

  // 5-letter words
  "house",
  "mouse",
  "horse",
  "nurse",
  "purse",
  "curse",
  "verse",
  "terse",
  "worse",
  "morse",
  "force",
  "source",
  "course",
  "coarse",
  "hoarse",
  "table",
  "cable",
  "fable",
  "gable",
  "sable",
  "stable",
  "enable",
  "unable",
  "maple",
  "apple",
  "ample",
  "sample",
  "simple",
  "dimple",
  "pimple",
  "ripple",
  "purple",
  "circle",
  "muscle",
  "hustle",
  "bustle",
  "rustle",
  "castle",
  "battle",
  "cattle",
  "rattle",
  "settle",
  "kettle",
  "nettle",
  "mettle",
  "little",
  "brittle",
  "spittle",
  "whittle",
  "bottle",
  "throttle",
  "mottle",
  "water",
  "later",
  "cater",
  "hater",
  "crater",
  "grater",
  "matter",
  "batter",
  "fatter",
  "latter",
  "patter",
  "scatter",
  "chatter",
  "flatter",
  "shatter",
  "clatter",
  "platter",
  "spatter",
  "tatter",
  "natter",
  "fetter",
  "better",
  "letter",
  "setter",
  "getter",
  "wetter",
  "petter",
  "netter",
  "jetter",

  // 6-letter words
  "friend",
  "ground",
  "around",
  "sound",
  "found",
  "bound",
  "mound",
  "pound",
  "round",
  "wound",
  "hound",
  "compound",
  "profound",
  "astound",
  "surround",
  "background",
  "playground",
  "underground",
  "fairground",
  "battleground",
  "middle",
  "riddle",
  "fiddle",
  "diddle",
  "piddle",
  "twiddle",
  "griddle",
  "saddle",
  "paddle",
  "waddle",
  "straddle",
  "handle",
  "candle",
  "bundle",
  "kindle",
  "spindle",
  "dwindle",
  "swindle",
  "rekindle",
  "single",
  "mingle",
  "tingle",
  "jingle",
  "shingle",
  "wringle",
  "cringle",
  "springle",
  "simple",
  "dimple",
  "pimple",
  "ripple",
  "nipple",
  "tipple",
  "sipple",
  "cripple",
  "gripple",
  "tripple",
  "stipple",
  "whipple",
  "shipple",

  // 7-letter words
  "example",
  "complex",
  "explain",
  "explore",
  "express",
  "extreme",
  "examine",
  "execute",
  "exclude",
  "include",
  "conclude",
  "preclude",
  "seclude",
  "intrude",
  "extrude",
  "protrude",
  "obtrude",
  "detrude",
  "retrude",
  "capture",
  "picture",
  "mixture",
  "texture",
  "feature",
  "nature",
  "mature",
  "future",
  "suture",
  "culture",
  "vulture",
  "pasture",
  "gesture",
  "posture",
  "rupture",
  "lecture",
  "puncture",
  "juncture",
  "tincture",
  "stricture",
  "fracture",
  "structure",
  "adventure",
  "departure",
  "furniture",
  "signature",
  "creature",
  "treasure",
  "measure",
  "pleasure",
  "leisure",
  "seizure",
  "closure",
  "exposure",
  "composure",
  "disclosure",
  "enclosure",
  "foreclosure",
]

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const calculateWordValue = (word: string): number => {
  return word
    .toUpperCase()
    .split("")
    .reduce((total, letter) => total + LETTER_VALUES[letter], 0)
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function Component() {
  const [letters, setLetters] = useState("")
  const [oneExtraPage, setOneExtraPage] = useState(1)
  const [twoExtraPage, setTwoExtraPage] = useState(1)

  const ITEMS_PER_PAGE = 20

  const handleInputChange = (value: string) => {
    // Only allow letters, max 7 characters
    const filtered = value
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 7)
    setLetters(filtered)
    // Reset pagination when letters change
    setOneExtraPage(1)
    setTwoExtraPage(1)
  }

  const canMakeWord = (word: string, availableLetters: string): boolean => {
    const letterCount: { [key: string]: number } = {}

    // Count available letters
    for (const letter of availableLetters) {
      letterCount[letter] = (letterCount[letter] || 0) + 1
    }

    // Check if word can be made
    for (const letter of word.toUpperCase()) {
      if (!letterCount[letter] || letterCount[letter] === 0) {
        return false
      }
      letterCount[letter]--
    }

    return true
  }

  const findWordsWithExtraLetters = (word: string, availableLetters: string, maxExtra: number): string[] => {
    const extraLetters: string[] = []

    // Generate all combinations of extra letters up to maxExtra
    if (maxExtra === 1) {
      for (const extraLetter of ALPHABET) {
        if (canMakeWord(word, availableLetters + extraLetter)) {
          extraLetters.push(extraLetter)
        }
      }
    } else if (maxExtra === 2) {
      for (const letter1 of ALPHABET) {
        for (const letter2 of ALPHABET) {
          if (canMakeWord(word, availableLetters + letter1 + letter2)) {
            const combo = [letter1, letter2].sort().join("")
            if (!extraLetters.includes(combo)) {
              extraLetters.push(combo)
            }
          }
        }
      }
    }

    return extraLetters
  }

  const { possibleWords, wordsWithOneExtra, wordsWithTwoExtra } = useMemo(() => {
    if (!letters) return { possibleWords: [], wordsWithOneExtra: [], wordsWithTwoExtra: [] }

    const possible: Array<{ word: string; value: number }> = []
    const withOneExtra: Array<{ word: string; extraLetters: string[]; value: number }> = []
    const withTwoExtra: Array<{ word: string; extraLetters: string[]; value: number }> = []

    for (const word of SCRABBLE_WORDS) {
      if (word.length >= 3 && word.length <= 7) {
        const wordValue = calculateWordValue(word)

        if (canMakeWord(word, letters)) {
          possible.push({ word, value: wordValue })
        } else {
          const oneExtraLetters = findWordsWithExtraLetters(word, letters, 1)
          const twoExtraLetters = findWordsWithExtraLetters(word, letters, 2)

          if (oneExtraLetters.length > 0) {
            withOneExtra.push({ word, extraLetters: oneExtraLetters, value: wordValue })
          } else if (twoExtraLetters.length > 0) {
            withTwoExtra.push({ word, extraLetters: twoExtraLetters, value: wordValue })
          }
        }
      }
    }

    return {
      possibleWords: possible.sort((a, b) => b.value - a.value || a.word.localeCompare(b.word)),
      wordsWithOneExtra: withOneExtra.sort((a, b) => b.value - a.value || a.word.localeCompare(b.word)),
      wordsWithTwoExtra: withTwoExtra.sort((a, b) => b.value - a.value || a.word.localeCompare(b.word)),
    }
  }, [letters])

  const groupedWords = useMemo(() => {
    const groups: { [key: number]: Array<{ word: string; value: number }> } = {}
    possibleWords.forEach(({ word, value }) => {
      const length = word.length
      if (!groups[length]) groups[length] = []
      groups[length].push({ word, value })
    })
    // Sort each group by value
    Object.keys(groups).forEach((key) => {
      groups[Number.parseInt(key)].sort((a, b) => b.value - a.value || a.word.localeCompare(b.word))
    })
    return groups
  }, [possibleWords])

  // Pagination for extra words
  const paginatedOneExtra = useMemo(() => {
    const startIndex = (oneExtraPage - 1) * ITEMS_PER_PAGE
    return wordsWithOneExtra.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [wordsWithOneExtra, oneExtraPage])

  const paginatedTwoExtra = useMemo(() => {
    const startIndex = (twoExtraPage - 1) * ITEMS_PER_PAGE
    return wordsWithTwoExtra.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [wordsWithTwoExtra, twoExtraPage])

  const oneExtraTotalPages = Math.ceil(wordsWithOneExtra.length / ITEMS_PER_PAGE)
  const twoExtraTotalPages = Math.ceil(wordsWithTwoExtra.length / ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="border border-gray-800 bg-gray-900 shadow-2xl">
          <CardHeader className="text-center border-b border-gray-800">
            <CardTitle className="text-3xl font-bold text-white">Scrabble Word Finder</CardTitle>
            <p className="text-gray-400">Enter your letters to find all possible words</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <Input
                  value={letters}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter your letters (max 7)"
                  className="text-center text-2xl font-bold tracking-widest uppercase bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500"
                  maxLength={7}
                />
              </div>

              {/* Scrabble Tiles Display */}
              {letters && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {letters.split("").map((letter, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-400 border-2 border-yellow-500 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform"
                    >
                      <span className="text-2xl font-bold text-black">{letter}</span>
                      <span className="absolute bottom-0 right-1 text-xs font-bold text-black">
                        {LETTER_VALUES[letter]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {letters && (
              <div className="space-y-6">
                {/* Words you can make */}
                <Card className="border border-green-800 bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-400 flex items-center gap-2">
                      Words You Can Make
                      <Badge variant="secondary" className="bg-green-900 text-green-300 border-green-700">
                        {possibleWords.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {possibleWords.length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(groupedWords)
                          .sort(([a], [b]) => Number.parseInt(b) - Number.parseInt(a))
                          .map(([length, words]) => (
                            <div key={length}>
                              <h4 className="font-semibold text-green-300 mb-2">
                                {length} Letters ({words.length} words)
                              </h4>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                {words.map(({ word, value }) => (
                                  <Badge
                                    key={word}
                                    variant="outline"
                                    className="bg-gray-800 border-green-600 text-green-300 hover:bg-green-900 transition-colors flex items-center justify-between p-2"
                                  >
                                    <span className="font-semibold">{word.toUpperCase()}</span>
                                    <span className="text-xs bg-green-700 px-2 py-1 rounded ml-2">{value}</span>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-green-400 italic">No words found with these letters.</p>
                    )}
                  </CardContent>
                </Card>

                <Separator className="bg-gray-800" />

                {/* Words with one extra letter */}
                <Card className="border border-blue-800 bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-400 flex items-center gap-2">
                      Words With One Extra Letter
                      <Badge variant="secondary" className="bg-blue-900 text-blue-300 border-blue-700">
                        {wordsWithOneExtra.length}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-blue-400">
                      These words can be made if you find the missing letter on the board
                    </p>
                  </CardHeader>
                  <CardContent>
                    {wordsWithOneExtra.length > 0 ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {paginatedOneExtra.map(({ word, extraLetters, value }) => (
                            <div
                              key={word}
                              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-blue-800 hover:bg-gray-750 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-lg font-semibold border-blue-600 text-blue-300 bg-gray-900"
                                >
                                  {word.toUpperCase()}
                                </Badge>
                                <span className="text-xs bg-blue-700 px-2 py-1 rounded text-blue-200">{value} pts</span>
                              </div>
                              <div className="flex gap-1">
                                <span className="text-sm text-blue-400 mr-2">Need:</span>
                                {extraLetters.slice(0, 3).map((letter) => (
                                  <Badge
                                    key={letter}
                                    variant="secondary"
                                    className="bg-blue-900 text-blue-300 text-xs border-blue-700"
                                  >
                                    {letter}
                                  </Badge>
                                ))}
                                {extraLetters.length > 3 && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-900 text-blue-300 text-xs border-blue-700"
                                  >
                                    +{extraLetters.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Pagination
                          currentPage={oneExtraPage}
                          totalPages={oneExtraTotalPages}
                          onPageChange={setOneExtraPage}
                        />
                      </div>
                    ) : (
                      <p className="text-blue-400 italic">No additional words found with one extra letter.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Words with two extra letters */}
                <Card className="border border-purple-800 bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-400 flex items-center gap-2">
                      Words With Two Extra Letters
                      <Badge variant="secondary" className="bg-purple-900 text-purple-300 border-purple-700">
                        {wordsWithTwoExtra.length}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-purple-400">
                      These words can be made if you find two missing letters on the board
                    </p>
                  </CardHeader>
                  <CardContent>
                    {wordsWithTwoExtra.length > 0 ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {paginatedTwoExtra.map(({ word, extraLetters, value }) => (
                            <div
                              key={word}
                              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-purple-800 hover:bg-gray-750 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-lg font-semibold border-purple-600 text-purple-300 bg-gray-900"
                                >
                                  {word.toUpperCase()}
                                </Badge>
                                <span className="text-xs bg-purple-700 px-2 py-1 rounded text-purple-200">
                                  {value} pts
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <span className="text-sm text-purple-400 mr-2">Need:</span>
                                {extraLetters.slice(0, 2).map((letters) => (
                                  <Badge
                                    key={letters}
                                    variant="secondary"
                                    className="bg-purple-900 text-purple-300 text-xs border-purple-700"
                                  >
                                    {letters}
                                  </Badge>
                                ))}
                                {extraLetters.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-purple-900 text-purple-300 text-xs border-purple-700"
                                  >
                                    +{extraLetters.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Pagination
                          currentPage={twoExtraPage}
                          totalPages={twoExtraTotalPages}
                          onPageChange={setTwoExtraPage}
                        />
                      </div>
                    ) : (
                      <p className="text-purple-400 italic">No additional words found with two extra letters.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
