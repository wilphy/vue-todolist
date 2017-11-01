;
(function () {
  'use strict';

  function copy(obj) {
    return Object.assign({}, obj);
  }

  Vue.component('task', {
    template: '#task-tpl',
    props: ['todo']
  })

  new Vue({
    el: '#main',
    data: {
      list: [],
      current: {}
    },

    mounted: function () {
      //把storage里的值取出来
      this.list = ms.get('list') || this.list;
    },

    methods: {
      //添加或更新方法
      merge: function () {
        // console.log('this.current:', this.current);

        var is_update, id;
        is_update = id = this.current.id;

        if (is_update) {
          var index = this.find_index(id);

          //vue需要这样来检测数据变化
          Vue.set(this.list, index, copy(this.current));

          this.list[index] = copy(this.current);
          console.log('this.list', this.list)

        } else {
          var title = this.current.title;
          if (!title && title !== 0) return;

          var todo = copy(this.current);

          //每添加一条新条目都会传入一个id
          todo.id = this.next_id();
          this.list.push(todo);
          // console.log('this.list:', this.list)
        }

        //设置localStorage，已用下面的Vue的watch方法代替
        // ms.set('list', this.list);

        //调用清空输入框方法
        this.reset_current();
      },

      //删除
      remove: function (id) {
        var index = this.find_index(id);
        this.list.splice(index, 1);

        //设置localStorage，已用下面的Vue的watch方法代替
        // ms.set('list', this.list);
      },

      next_id: function () {
        return this.list.length + 1;
      },

      set_current: function (todo) {
        this.current = copy(todo);
      },

      //每次插入或更新后清空输入框
      reset_current: function () {
        this.set_current({});
      },

      find_index: function (id) {
        return this.list.findIndex(function (item) {
          return item.id == id;
        })
      },

      toggle_complete: function (id) {
        var i = this.find_index(id);
        //vue需要这样来检测数据变化
        Vue.set(this.list[i], 'completed', !this.list[i].completed);
      }
    },

    watch: {
      list: {
        deep: true,
        handler: function (n, o) { // n = new_val, o = old_val 
          if (n) {
            ms.set('list', n);
          } else {
            ms.set('list', []);
          }
        }
      }
    }

  });

})();