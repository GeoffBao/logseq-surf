(ns frontend.components.whiteboard.core
  (:require [rum.core :as rum]
            [frontend.ui :as ui]
            [frontend.context.i18n :refer [t]]))

(rum/defc whiteboards-page
  []
  [:div.whiteboard-module.relative.w-full.h-full.p-8
   {:style {:height "calc(100vh - 48px)"}}
   [:h1.text-2xl.font-bold "Whiteboards"]
   [:p.mt-4 "Welcome to the new Whiteboards module!"]
   [:p.mt-2.text-gray-500 "Phase 1: Foundation loaded. Tldraw integration pending."]
   [:p.mt-4.text-sm.text-gray-400 "Note: Tldraw integration is temporarily disabled due to build issues with @radix-ui/react-collection."]])
