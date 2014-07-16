/* ========================================================================
 * listgroup.js v1.0.0
 * http://rickardn.github.io/listgroup.js
 * ========================================================================
 * Copyright 2014 Rickard Nilsson
 * Licensed under MIT (https://github.com/rickardn/listgroup.js/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    "use strict";

    var select,
        unselect,
        add,
        init;

    // LISTGROUP PUBLIC CLASS DEFINITION
    // =======================
    var ListGroup = function (element, options) {
        this.$element = $(element);
        this.options = options;
        this.init(element, options);
    };

    ListGroup.prototype.init = function() {
        var me = this;

        var $group = this.$element;
        var config = this.options;

        if (config && config.toggle)
            $group.data('toggle', config.toggle);

        // TODO: refactor to .on('click'
        $('.list-group-item', $group).click(function () {
            var $item = $(this);

            if ($group.data('toggle') == 'buttons') {
                $item.toggleClass('active')
                     .blur();
            } else {
                me.unselect()
                  .select($item);
            }

            if (config && config.click)
                config.click.apply(this);

            return false;
        });
    };

    /* item can be any of the following:
    *  1. selection
    *     Type: jQuery
    *     An existing jQuery object to select
    *  2. value
    *     Type: string
    *     A value 
    *  3. values
    *     Type: Array
    *     An array of values
    */
    ListGroup.prototype.select = function (item) {
        var group = this.$element;

        if (item instanceof $)
            item.addClass('active')
                .blur();

        if (typeof item === 'string')
            item = [item];

        if (Array.isArray(item)) {
            for (var i in item) {
                var val = item[i];
                $(group)
                    .find('.list-group-item[data-value=\'' + val + '\']')
                    .addClass('active');
            }
        }
    };

    ListGroup.prototype.unselect = function (item) {
        //unselect(this.$element, item);
        var group = this.$element;

        $(group).find('.list-group-item').each(function (i, listItem) {
            $(listItem).removeClass('active');
        });

        return this;
    };

    
   
    //select = function (group, item) {
    //    if ($(group).data('toggle') != 'buttons')
    //        unselect(group);

    //    if (item instanceof $)
    //        item.addClass('active')
    //            .blur();

    //    if (typeof item === 'string')
    //        item = [item];

    //    if (Array.isArray(item)) {
    //        for (var i in item) {
    //            var val = item[i];
    //            $(group)
    //                .find('.list-group-item[data-value=\'' + val + '\']')
    //                .addClass('active');
    //        }
    //    }
    //};

    //unselect = function (group, item) {
    //    $(group).find('.list-group-item').each(function (i, listItem) {
    //        $(listItem).removeClass('active');
    //    });
    //};

    add = function (group, item) {
        $(group).append(item);
    };

    //init = function (group, config) {
    //    if (config && config.toggle)
    //        $(group).data('toggle', config.toggle);

    //    // TODO: refactor to .on('click'
    //    $('.list-group-item', group).click(function() {
    //        var $item = $(this);

    //        select(group, $item);

    //        if (config && config.click)
    //            config.click.apply(this);

    //        return false;
    //    });
    //};

    // SELECTLIST PUBLIC CLASS DEFINITION
    // =======================
    var SelectList = function(element, options) {
        this.$element = $(element);
        this.options = options;
        this.$listGroup = this.createListGroup();
    };

    SelectList.prototype.select = function (values) {
        if (values instanceof $) {
            var vals = [];
            values.each(function(i, element) {
                vals.push($(element).val());
            });
            values = vals;
        } 

        this.$element.val(values)
                     .change();
    };

    SelectList.prototype.unselect = function(values) {
        var value = this.$element.val();

        if (!Array.isArray(value)) value = [value];
        if (!Array.isArray(values)) values = [values];

        for (var i in values) {
            value.pop(values[i]);
        }
        this.$element.val(value)
                     .change();
    };

    SelectList.prototype.createListGroup = function() {
        var $select = this.$element;

        // create a list-group
        var listGroup = $('<ul class="list-group"></ul>');

        if ($select.attr('multiple'))
            listGroup.data('toggle', 'buttons');

        $select.find('option').each(function (j, item) {
            var html = '<a href="#" class="list-group-item" ';
            html += 'data-value="' + $(item).val() + '">'
                 + $(item).text() + '</a>';

            var $item = $(html);
            listGroup.append($item);
        });

        $select.change(function (e) {
            listGroup.listgroup({ select: $select.val() });
        });

        listGroup.listgroup({
            select: $select.val(),
            click: function () {
                // todo: multiple
                $select.val($(this).data('value'));
            }
        });
        $select.before(listGroup);
        this.$listGroup = listGroup;

        // TODO: hide $select
        return listGroup;
    };

    
    // LIST GROUP PLUGIN DEFINITION
    // =======================
    $.fn.listgroup = function (option) {
        return this.each(function (i, group) {
            var $group = $(group);

            var list = $group.data('listgroup');
            if (!list)
                $group.data('listgroup', (list = $group.is('select')
                    ? new SelectList(group, option)
                    : new ListGroup(group, option)));

            // move to constructor?
            if (typeof option === 'object') {

                if (option.unselect)
                    list.unselect(option.unselect);

                if (option.add)
                    add(group, option.add);

                if (option.select)
                    list.select(option.select);
            }
        });
    };

    $(function () {
        // todo: $.support
        $('select.list-group').listgroup();
    });
}(jQuery);
