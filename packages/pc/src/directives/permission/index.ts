import type { App, DirectiveBinding } from 'vue'

export default (app: App) => {
  app.directive('permission', {
    mounted(el: Element, binding: DirectiveBinding) {
      const { value } = binding
      const list = JSON.parse(sessionStorage.getItem('spider-permissionList')!)
      const exist = value.every((item: string) => list?.includes(item))

      if (!exist) {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      }
    },
  })
}
