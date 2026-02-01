(ns frontend.components.whiteboard.core
  (:require [rum.core :as rum]
   [frontend.rum :as r]
   [frontend.ui :as ui]
   [frontend.context.i18n :refer [t]]
            [frontend.db :as db]
   [frontend.handler.route :as route]
   ["@tldraw/tldraw" :refer [Tldraw]]
   ["./custom_shapes.js" :refer [LogseqPageShapeUtil YouTubeEmbedShapeUtil SectionShapeUtil SubBoardShapeUtil uiOverrides]]))

(def tldraw-component (r/adapt-class Tldraw))

(def shape-utils #js [LogseqPageShapeUtil YouTubeEmbedShapeUtil SectionShapeUtil SubBoardShapeUtil])

(js/console.log "--- Core CLJS Debug ---")
(js/console.log "Shape Utils Array:" shape-utils)
(js/console.log "LogseqPageShapeUtil:" LogseqPageShapeUtil)
(js/console.log "-----------------------")

(defn inject-api! []
  (set! js/window.logseqWhiteboardApi
        #js {:navigateToPage (fn [page-id page-title]
                               (if (seq page-id)
                                 (route/redirect-to-page! page-id)
                                 (route/redirect-to-page! page-title)))
             :getPageInfo (fn [page-title]
                            (when-let [page (db/get-page page-title)]
                              #js {:id (str (:db/id page))
                                   :content (or (some-> (:block/content page) (subs 0 100))
                                                "Page content preview...")}))}))

(rum/defc whiteboards-page
  < {:did-mount inject-api!}
  []
  [:div.whiteboard-module.relative.w-full.h-full
   {:style {:height "calc(100vh - 48px)"}}
   ;; Toolbar overlay
   [:div.absolute.top-4.right-4.z-50.flex.gap-2
    (ui/button "Save"
               :on-click (fn [] (js/alert "Whiteboard saved! (Demo persistence is active)"))
               :variant :primary
               :size :sm)]
   ;; Tldraw Container
   [:div.w-full.h-full.relative.z-0
    (tldraw-component {:persistenceKey "logseq-whiteboard-demo"
                       :autoFocus true
                       :shapeUtils shape-utils
                       :overrides uiOverrides})]])
