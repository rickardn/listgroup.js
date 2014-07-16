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
        init(this.$element, this.options);
    };

    ListGroup.prototype.select = function (item) {
        select(this.$element, item);
    };

    ListGroup.prototype.unselect = function (item) {
        unselect(this.$element, item);
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
    select = function (group, item) {
        //todo: if ($(group).data('toggle') != 'buttons')
        unselect(group);

        if (item instanceof $)
            item
                .addClass('active')
                .blur();

        if (typeof item === 'string')
            $(group)
                .find('.list-group-item[data-value=\'' + item + '\']')
                .addClass('active');

        if (Array.isArray(item)) {
            for (var i in item) {
                var val = item[i];
                $(group)
                    .find('.list-group-item[data-value=\'' + val + '\']')
                    .addClass('active');
            }
        }
    };

    unselect = function (group, item) {
        $(group).find('.list-group-item').each(function (i, listItem) {
            $(listItem).removeClass('active');
        });
    };

    add = function (group, item) {
        $(group).append(item);
    };

    init = function (group, config) {
        if (config && config.toggle)
            $(group).data('toggle', config.toggle);

        // TODO: refactor to .on('click'
        $('.list-group-item', group).click(function() {
            var $item = $(this);

            select(group, $item);

            if (config && config.click)
                config.click.apply(this);

            return false;
        });
    };

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
        var init,
            config = option;

        init = function (group) {
            // TODO: move to constructor
            if (config && config.toggle)
                $(group).data('toggle', config.toggle);

            // TODO: move to constructor?
            // TODO: refactor to .on('click'
            $('.list-group-item', group).click(function() {
                var $item = $(this);

                select(group, $item);

                if (config && config.click)
                    config.click.apply(this);

                return false;
            });
        };

        this.each(function (i, group) {

            // you should be able to use the same API regardsless if you're using a select or a list-group
            // 

            var $group = $(group);

            var data = $group.data('listgroup');
            if (!data)
                $group.data('listgroup', (data = $group.is('select')
                    ? new SelectList(group, option)
                    : new ListGroup(group, option)));

            //if ($group.is('select')) {
            //    var data = $group.data('select');
            //    if (!data) $group.data('select', (data = new SelectList(group, option)));
            //    return true;
            //}

            // else group is a list-group

            //var data = $group.data('listgroup');
            //if (!data) $group.data('listgroup', (data = new ListGroup(group, option)));


            // move to constructor? - these are different 
            if (typeof config === 'object') {

                if (config.unselect) {
                    data.unselect(config.unselect);
                }

                if (config.add) {
                    add(group, config.add);
                }

                if (config.select) {
                    data.select(config.select);
                }

                // note: should it be possible to redefine click?
                if (config.click) {
                    // move to constructor?
                    //init(group);
                }

            } else {
                //init(group);
            }
        });

        // remove item
        // value?

        return this;
    };

    //$(function () {
    //    // todo: $.support
    //    $('.list-group').listgroup();
    //});
}(jQuery);
