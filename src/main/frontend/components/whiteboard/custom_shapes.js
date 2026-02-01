import { ShapeUtil, HTMLContainer, T } from '@tldraw/tldraw'
import React from 'react'

// Section Shape
export class SectionShapeUtil extends ShapeUtil {
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

SectionShapeUtil.type = 'section'
SectionShapeUtil.migrations = {}
SectionShapeUtil.props = {
  w: T.number,
  h: T.number,
  title: T.string,
  color: T.string,
}

// Sub-board Shape
export class SubBoardShapeUtil extends ShapeUtil {
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

SubBoardShapeUtil.type = 'subboard'
SubBoardShapeUtil.migrations = {}
SubBoardShapeUtil.props = {
  w: T.number,
  h: T.number,
  title: T.string,
  boardId: T.string,
}

// Logseq Page Shape
export class LogseqPageShapeUtil extends ShapeUtil {
  getDefaultProps() {
    return {
      w: 240,
      h: 160,
      pageId: '',
      pageTitle: 'Untitled Page',
      pageContent: ''
    }
  }

  component(shape) {
    const { pageTitle, pageContent, pageId } = shape.props

    const handleDoubleClick = () => {
      if (window.logseqWhiteboardApi && window.logseqWhiteboardApi.navigateToPage) {
        window.logseqWhiteboardApi.navigateToPage(pageId, pageTitle)
      } else {
        alert(`Navigate to: ${pageTitle} (${pageId})`)
      }
    }

    return React.createElement(HTMLContainer,
      {
        style: {
          backgroundColor: '#ffffff',
          border: '2px solid #0066cc',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,102,204,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          pointerEvents: 'all',
          cursor: 'pointer'
        },
        onDoubleClick: handleDoubleClick
      },
      React.createElement('div',
        {
          style: {
            padding: '12px',
            borderBottom: '1px solid rgba(0,102,204,0.2)',
            backgroundColor: 'rgba(0,102,204,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }
        },
        React.createElement('span', { style: { fontSize: '18px' } }, '📄'),
        React.createElement('span',
          {
            style: {
              fontWeight: 600,
              fontSize: '14px',
              color: '#0066cc',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }
          },
          pageTitle
        )
      ),
      React.createElement('div',
        {
          style: {
            padding: '12px',
            flex: 1,
            fontSize: '12px',
            color: '#666',
            overflow: 'hidden',
            lineHeight: '1.4'
          }
        },
        pageContent || 'Double-click to open page'
      ),
      React.createElement('div',
        {
          style: {
            padding: '8px 12px',
            fontSize: '10px',
            color: '#999',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            textAlign: 'center'
          }
        },
        '🔗 Logseq Page'
      )
    )
  }

  indicator(shape) {
    return React.createElement('rect', { width: shape.props.w, height: shape.props.h, rx: 8, ry: 8 })
  }
}

LogseqPageShapeUtil.type = 'logseq-page'
LogseqPageShapeUtil.migrations = {}
LogseqPageShapeUtil.props = {
  w: T.number,
  h: T.number,
  pageId: T.string,
  pageTitle: T.string,
  pageContent: T.string,
}

// YouTube Embed Shape
export class YouTubeEmbedShapeUtil extends ShapeUtil {
  getDefaultProps() {
    return {
      w: 480,
      h: 270,
      videoId: '',
      videoTitle: 'YouTube Video',
      isPlaying: false
    }
  }

  component(shape) {
    const { videoId, videoTitle, isPlaying, w, h } = shape.props
    const thumbnailUrl = videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : ''

    const [playing, setPlaying] = React.useState(isPlaying)

    const handlePlay = (e) => {
      e.stopPropagation()
      setPlaying(true)
    }

    if (playing && videoId) {
      return React.createElement(HTMLContainer,
        {
          style: {
            pointerEvents: 'all',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }
        },
        React.createElement('iframe', {
          width: w,
          height: h,
          src: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
          frameBorder: '0',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowFullScreen: true,
          style: { display: 'block' }
        })
      )
    }

    return React.createElement(HTMLContainer,
      {
        style: {
          backgroundColor: '#000',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'all',
          cursor: 'pointer',
          position: 'relative'
        }
      },
      // Thumbnail
      videoId && React.createElement('img', {
        src: thumbnailUrl,
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0
        },
        alt: videoTitle
      }),
      // Overlay with play button
      React.createElement('div',
        {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)'
          },
          onClick: handlePlay
        },
        React.createElement('div',
          {
            style: {
              width: '68px',
              height: '48px',
              backgroundColor: 'rgba(255,0,0,0.9)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }
          },
          React.createElement('div', {
            style: {
              width: 0,
              height: 0,
              borderLeft: '20px solid white',
              borderTop: '12px solid transparent',
              borderBottom: '12px solid transparent',
              marginLeft: '4px'
            }
          })
        )
      ),
      // Title bar
      React.createElement('div',
        {
          style: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '8px 12px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: 'white',
            fontSize: '12px',
            fontWeight: 500
          }
        },
        '▶️ ' + videoTitle
      )
    )
  }

  indicator(shape) {
    return React.createElement('rect', { width: shape.props.w, height: shape.props.h, rx: 8, ry: 8 })
  }
}

YouTubeEmbedShapeUtil.type = 'youtube-embed'
YouTubeEmbedShapeUtil.migrations = {}
YouTubeEmbedShapeUtil.props = {
  w: T.number,
  h: T.number,
  videoId: T.string,
  videoTitle: T.string,
  isPlaying: T.boolean,
}

// Helper to extract YouTube video ID from URL
export function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
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
      },
      'logseq-page-tool': {
        id: 'logseq-page-tool',
        icon: 'file',
        label: 'Add Logseq Page',
        kbd: 'p',
        onSelect: () => {
          const pageTitle = window.prompt('Enter Logseq page name:')
          if (pageTitle) {
            const id = Date.now().toString()
            let pageId = ''
            let pageContent = ''
            if (window.logseqWhiteboardApi && window.logseqWhiteboardApi.getPageInfo) {
              const info = window.logseqWhiteboardApi.getPageInfo(pageTitle)
              if (info) {
                pageId = info.id || ''
                pageContent = info.content || ''
              }
            }
            editor.createShape({
              id: 'shape:' + id,
              type: 'logseq-page',
              x: editor.inputs.currentPagePoint.x + 50,
              y: editor.inputs.currentPagePoint.y + 50,
              props: {
                pageId: pageId,
                pageTitle: pageTitle,
                pageContent: pageContent
              }
            })
          }
        }
      },
      'youtube-tool': {
        id: 'youtube-tool',
        icon: 'video',
        label: 'Add YouTube Video',
        kbd: 'y',
        onSelect: () => {
          const url = window.prompt('Enter YouTube URL or video ID:')
          if (url) {
            const videoId = extractYouTubeId(url)
            if (videoId) {
              const id = Date.now().toString()
              editor.createShape({
                id: 'shape:' + id,
                type: 'youtube-embed',
                x: editor.inputs.currentPagePoint.x + 50,
                y: editor.inputs.currentPagePoint.y + 50,
                props: {
                  videoId: videoId,
                  videoTitle: 'YouTube Video'
                }
              })
            } else {
              alert('Invalid YouTube URL')
            }
          }
        }
      }
    }
  },
  toolbar(editor, toolbar, { tools }) {
    const newToolbar = [...toolbar]
    // Insert tools
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
    newToolbar.splice(6, 0, {
      id: 'logseq-page-tool',
      type: 'item',
      readonly: false,
      toolItem: tools['logseq-page-tool']
    })
    newToolbar.splice(7, 0, {
      id: 'youtube-tool',
      type: 'item',
      readonly: false,
      toolItem: tools['youtube-tool']
    })
    return newToolbar
  }
}

// Debug logs
console.log('--- Custom Shapes Debug ---')
console.log('T:', T)
console.log('SectionShapeUtil:', SectionShapeUtil)
console.log('  props:', SectionShapeUtil.props)
console.log('  migrations:', SectionShapeUtil.migrations)
console.log('SubBoardShapeUtil:', SubBoardShapeUtil)
console.log('LogseqPageShapeUtil:', LogseqPageShapeUtil)
console.log('YouTubeEmbedShapeUtil:', YouTubeEmbedShapeUtil)
console.log('---------------------------')
