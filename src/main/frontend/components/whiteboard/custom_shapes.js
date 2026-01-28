import { ShapeUtil, HTMLContainer } from '@tldraw/tldraw'
import React from 'react'

// Section Shape
export class SectionShapeUtil extends ShapeUtil {
  static type = 'section'
  static migrations = {}

  getDefaultProps() {
    return {
      w: 300,
      h: 300,
      title: 'New Section',
      color: '#f5f5f5'
    }
  }

  component(shape) {
    const { w, h, title, color } = shape.props
    return React.createElement(HTMLContainer, 
      { 
        style: { 
          backgroundColor: color,
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'all'
        } 
      },
      React.createElement('div', 
        { 
          style: { 
            padding: '8px 12px',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            fontWeight: 600,
            fontSize: '14px',
            color: '#333'
          } 
        }, 
        title
      ),
      React.createElement('div', { style: { flex: 1 } })
    )
  }

  indicator(shape) {
    return React.createElement('rect', { width: shape.props.w, height: shape.props.h })
  }
}

// Sub-board Shape
export class SubBoardShapeUtil extends ShapeUtil {
  static type = 'subboard'
  static migrations = {}

  getDefaultProps() {
    return {
      w: 200,
      h: 120,
      title: 'Untitled Board',
      boardId: ''
    }
  }

  component(shape) {
    const { w, h, title } = shape.props
    return React.createElement(HTMLContainer, 
      { 
        style: { 
          backgroundColor: '#fff',
          border: '1px solid #333',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          boxShadow: '4px 4px 0px rgba(0,0,0,1)',
          pointerEvents: 'all'
        } 
      },
      React.createElement('div', { style: { fontSize: '24px', marginBottom: '8px' } }, '🎨'),
      React.createElement('div', { style: { fontWeight: 'bold', fontSize: '16px' } }, title),
      React.createElement('div', { style: { fontSize: '10px', color: '#666', marginTop: '4px' } }, '(Double click to open)')
    )
  }

  indicator(shape) {
    return React.createElement('rect', { width: shape.props.w, height: shape.props.h })
  }
}

// UI Overrides
export const uiOverrides = {
  tools(editor, tools) {
    return {
      ...tools,
      'section-tool': {
        id: 'section-tool',
        icon: 'frame',
        label: 'Create Section',
        kbd: 's',
        onSelect: () => {
          const id = Date.now().toString()
          editor.createShape({ 
            id: 'shape:' + id,
            type: 'section', 
            x: editor.inputs.currentPagePoint.x + 100, 
            y: editor.inputs.currentPagePoint.y + 100 
          })
        }
      },
      'subboard-tool': {
        id: 'subboard-tool',
        icon: 'group',
        label: 'Create Sub-board',
        kbd: 'b',
        onSelect: () => {
          const id = Date.now().toString()
          editor.createShape({ 
            id: 'shape:' + id,
            type: 'subboard', 
            x: editor.inputs.currentPagePoint.x + 300, 
            y: editor.inputs.currentPagePoint.y + 100 
          })
        }
      }
    }
  },
  toolbar(editor, toolbar, { tools }) {
    // Add tools to the toolbar
    const newToolbar = [...toolbar]
    // Insert after 'frame' tool (usually index 4 or 5)
    newToolbar.splice(4, 0, {
      id: 'section-tool',
      type: 'item',
      readonly: false,
      toolItem: tools['section-tool']
    })
    newToolbar.splice(5, 0, {
      id: 'subboard-tool',
      type: 'item',
      readonly: false,
      toolItem: tools['subboard-tool']
    })
    return newToolbar
  }
}
