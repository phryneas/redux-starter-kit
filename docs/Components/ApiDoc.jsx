import React from 'react'
import jsonObject from '../../temp/toolkit.api.json'
// import { ApiModel } from './ApiModel'
import { Deserializer, ApiItem } from '@microsoft/api-extractor-model'
import {
  DeserializerContext,
  ApiJsonSchemaVersion
} from '@microsoft/api-extractor-model/lib/model/DeserializerContext'

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
  data = jsonObject,
  canonicalReferences = new Map()
) {
  canonicalReferences.set(data.canonicalReference, data)
  for (const member of data.members || []) {
    collectCanonicalReferences(member, canonicalReferences)
  }
  return canonicalReferences
}

const canonicalReferences = collectCanonicalReferences()

const context = new DeserializerContext({
  apiJsonFilename: '',
  toolPackage: jsonObject.metadata.toolPackage,
  toolVersion: jsonObject.metadata.toolVersion,
  versionToDeserialize: ApiJsonSchemaVersion.LATEST
})

const item = ApiItem.deserialize(jsonObject, context)

/*
const apiModel = new ApiModel()
apiModel.addMember()
console.log(apiModel)
*/

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
      <h1>{node.name}</h1>
      <p style={{ whiteSpace: 'pre' }}>{node.docComment}</p>
      <pre style={{ backgroundColor: 'white' }}>
        {JSON.stringify(node, null, 2)}
      </pre>
    </div>
  )
}
