import unified from 'unified'
import parse from 'remark-parse'
import remark2react from 'remark-react'

/**
 * A basic parser for markdown strings that can be use in MDX docs
 * Similar to the old Docusaurus CompLibrary.MarkdownBlock
 */

export const Markdown = ({ children }) =>
  unified()
    .use(parse)
    .use(remark2react)
    .processSync(children).result
