/* ========================================================================
 * listgroup.js v1.0.0
 * http://rickardn.github.io/listgroup.js
 * ========================================================================
 * Copyright 2014 Rickard Nilsson (http://rickardnilsson.net)
 * Licensed under MIT (https://github.com/rickardn/listgroup.js/blob/master/LICENSE)
 * ======================================================================== */


(function ($) {
    var select,
        unselect,
        add;

    // split up in two classes?
    // one for handling list-groups
    // and one for handling select elements
    // first: split up into one class

    var SelectList = function(element, options) {
        this.$element = $(element);
        this.options = options;
        this.createListGroup();
    };

    SelectList.prototype.createListGroup = function() {
        var $group = this.$element;

        // create a list-group
        var listGroup = $('<ul class="list-group"></ul>');

        if ($group.attr('multiple'))
            listGroup.data('toggle', 'buttons');

        $group.find('option').each(function (j, item) {
            var html = '<a href="#" class="list-group-item" ';
            html += 'data-value="' + $(item).val() + '">'
                 + $(item).text() + '</a>';

            var $item = $(html);
            listGroup.append($item);
        });

        $group.change(function (e) {
            listGroup.listgroup({ select: $group.val() });
        });

        listGroup.listgroup({
            select: $group.val(),
            click: function () {
                $group.val($(this).data('value'));
            }
        });
        $group.before(listGroup);
    };

    
    var ListGroup = function(element, options) {
        this.$element = $(element);
        this.options = options;
    };

    ListGroup.prototype.select = function(item) {
        select(this.$element, item);
    };

    ListGroup.prototype.unselect = function(item) {
        unselect(this.$element, item);
    };

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

    add = function(group, item) {
        $(group).append(item);
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

            // TODO: refactor to select class
            if ($(group).prop('tagName') === 'SELECT') {

                var sl = new SelectList(group, option);

                return true;
            }

            // else group is a list-group

            var data = $(group).data('listgroup');
            if (!data) $(group).data('listgroup', (data = new ListGroup(group, option)));


            if (typeof config === 'object') {

                if (config.unselect) {
                    //unselect(group, config.unselect);
                    data.unselect(config.unselect);
                }

                if (config.add) {
                    add(group, config.add);
                }

                if (config.select) {
                    //select(group, config.select);
                    data.select(config.select);
                }

                // note: should it be possible to redefine click?
                if (config.click) {
                    // move to constructor?
                    init(group);
                }

            } else {
                init(group);
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
}(jQuery));
