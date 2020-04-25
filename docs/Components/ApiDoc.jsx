import React from 'react'
import json from '../../temp/toolkit.api.json'

// Sample config for when we have data inputs
const columns = [
  { title: 'Parameter', field: 'parameter' },
  { title: 'Type', field: 'type', minWidth: 100 },
  { title: 'Description', field: 'description', minWidth: 300 }
]
const data = [
  { parameter: 'banana', type: 'string', description: 'hi there guy' },
  {
    parameter: 'superDuperLongParam',
    type: 'boolean',
    description: 'Pass me in if you dare!'
  }
]

const fill = (string, minLength) => {
  while (string.length < minLength) {
    string += ' ' // TODO: these are getting dropped and not preserving the desired functionality. I know this is a react thing, but need to handle.
  }
  return string
}

const buildMarkdownTable = ({ columns = [], data = [] }) => {
  // TODO: could throw dev warnings for these
  if (!columns.length) return
  if (!data.length) return

  let tableResult = []

  // Build column widths
  const columnWidths = columns.map((col, i) =>
    Math.max(col.minWidth || 4, ...data.map(entry => entry[col.field].length))
  )
  // Build headers
  const headers = columns.map(col => col.title)

  // Insert headers row
  tableResult.push(
    `|${headers.map((h, i) => fill(h, columnWidths[i])).join('|')}|`
  )

  // Insert headers divider row
  tableResult.push(
    `|${columnWidths.map(width => '-'.repeat(width)).join('|')}|`
  )

  for (const entry of data) {
    // Fill the value with X required padding to maintain desired output
    const filled = Object.values(entry).map((key, i) =>
      fill(key, columnWidths[i])
    )
    tableResult.push(`|${filled.join('|')}|`)
  }

  return tableResult.join('\n')
}

/**
 * @typedef {{
 *   kind: string
 *   canonicalReference: string
 *   members?: Node[]
 * }} Node
 */

/**
 *
 * @param {Node} data
 * @param {Map<string, Node>} canonicalReferences
 */
function collectCanonicalReferences(
  data = json,
  canonicalReferences = new Map()
) {
  canonicalReferences.set(data.canonicalReference, data)
  for (const member of data.members || []) {
    collectCanonicalReferences(member, canonicalReferences)
  }
  return canonicalReferences
}

const canonicalReferences = collectCanonicalReferences()

/**
 *
 * @param {{reference: string}} props
 */
export function ApiDoc(props) {
  const node = canonicalReferences.get(props.reference)
  if (!node) {
    return <p>ApiDoc for {props.reference} not found!</p>
  }
  return (
    <div style={{ border: '1px solid black' }}>
      {props.render({
        paramsTable: buildMarkdownTable({ columns, data })
      })}
      <h1>{node.name}</h1>
      <p style={{ whiteSpace: 'pre' }}>{node.docComment}</p>
      <pre style={{ backgroundColor: 'white' }}>
        {JSON.stringify(node, null, 2)}
      </pre>
    </div>
  )
}
