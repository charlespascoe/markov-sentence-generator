import * as fs from 'fs';


function words(input: string): string[] {
  const wordRegexp = /[a-z'-]+/gi;

  let match: RegExpExecArray | null;

  const result: string[] = [];

  while (match = wordRegexp.exec(input)) {
    result.push(match[0].toLowerCase());
  }

  return result;
}


interface Entries {
  [nextWord: string]: number;
}

interface Chain {
  [word: string]: Entries;
}


function buildChain(words: string[]): Chain {
  const result: Chain = {};
  let prevWord: string | null = null;

  for (const word of words) {
    if (prevWord !== null) {
      const entries = result[prevWord] || {};
      result[prevWord] = entries;
      entries[word] = (entries[word] || 0) + 1;
    }

    prevWord = word;
  }

  for (const word in result) {
    const entries = result[word];

    const total = Object.values(entries)
      .reduce((sum, count) => sum + count, 0);

    for (const nextWord in entries) {
      entries[nextWord] = entries[nextWord] / total;
    }
  }

  return result;
}


function generateWords(chain: Chain, firstWord: string, length: number): string[] {
  if (!chain.hasOwnProperty(firstWord)) {
    throw new Error(`Invalid first word: ${firstWord}`);
  }

  const result: string[] = [firstWord];
  let prevWord: string = firstWord;

  for (let i = 0; i < length - 1; i++) {
    const word = pickWord(chain[prevWord]);

    result.push(word);
    prevWord = word;
  }

  return result;
}


function pickWord(entries: Entries): string {
  let rand = Math.random();
  let selectedWord: string | null = null;

  for (const word in entries) {
    selectedWord = word;

    const weight = entries[word];

    rand -= weight;

    if (rand < 0) {
      break;
    }
  }

  if (selectedWord === null) {
    throw new Error('No words given');
  }

  return selectedWord;
}


const source = fs.readFileSync('input.txt', {encoding: 'utf-8'});

const sourceWords = words(source);

const chain = buildChain(sourceWords);

const output = generateWords(chain, 'the', 100);

console.log(output.join(' '));
