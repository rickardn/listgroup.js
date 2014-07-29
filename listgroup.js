/*!========================================================================
 * listgroup.js v1.1.2
 * http://rickardn.github.io/listgroup.js
 * ========================================================================
 * Copyright 2014 Rickard Nilsson
 * Licensed under MIT (https://github.com/rickardn/listgroup.js/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    "use strict";


    // LISTGROUP PUBLIC CLASS DEFINITION
    // =======================
    var ListGroup = function (element, options) {
        this.$element = $(element);
        this.options = options || {};
        this.init();
    };

    ListGroup.prototype.init = function() {
        var me = this;
        var $element = this.$element;
        var options = this.options;

        if (options.toggle)
            $element.attr('data-toggle', options.toggle);

        $element.on('click', '.list-group-item', function () {
            var $item = $(this);

            if (!$item.hasClass('disabled')) {

                if ($element.data('toggle') == 'items')
                    $item.toggleClass('active');
                else
                    me.unselect('*')
                      .select($item);

                if (options.click)
                    options.click.apply(this);
            }

            $item.blur();
            return false;
        });
    };

    ListGroup.prototype.select = function (item) {
        if (item instanceof $)
            item.addClass('active');

        if (typeof item === 'string')
            item = [item];

        if (Array.isArray(item)) {
            for (var i in item) {
                var val = item[i];
                this.$element
                    .find('.list-group-item[data-value=\'' + val + '\']')
                    .addClass('active');
            }
        }
        return this;
    };

    ListGroup.prototype.unselect = function (selector) {
        this.$element
                .find('.list-group-item')
                .filter(selector || '*')
                    .removeClass('active');
        return this;
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

    SelectList.prototype.unselect = function(values) {
        var value = this.$element.val();

        if (!Array.isArray(value)) value = [value];
        if (!Array.isArray(values)) values = [values];

        for (var i in values)
            value.pop(values[i]);

        this.$element.val(value)
                     .change();
    };

    SelectList.prototype.createListGroup = function() {
        var $select = this.$element;

        var $listGroup = $('<ul>').addClass('list-group');

        if ($select.attr('multiple'))
            $listGroup.attr('data-toggle', 'items');

        $select.find('option').each(function (i, item) {
            var $item = $(item);
    
            var $new = $('<a>')
                        .attr('href', '#')
                        .addClass('list-group-item')
                        .attr('data-value', $item.val())
                        .text($item.text());

            if ($item.is(':disabled'))
                $new.addClass('disabled');

            if ($item.css('display') === 'none')
                $new.addClass('hidden');

            $listGroup.append($new);
        });

        $select.change(function () {
            $listGroup.listgroup({
                unselect: '*',
                select: $select.val()
            });
        });

        $listGroup.listgroup({
            select: $select.val(),
            click: function () {
                var values = [];
                $listGroup.find('.list-group-item.active').each(function(i, item) {
                    var value = $(item).data('value');
                    values.push(value);
                });
                if (values.length == 1) values = values[0];
                $select.val(values);
            }
        });
        $select.before($listGroup);
        this.$listGroup = $listGroup;

        $select.hide();

        return $listGroup;
    };

    
    // LIST GROUP PLUGIN DEFINITION
    // =======================
    $.fn.listgroup = function (option) {
        return this.each(function (i, element) {
            var $element = $(element);

            var list = $element.data('listgroup');
            if (!list)
                $element.data('listgroup', (list = $element.is('select')
                    ? new SelectList(element, option)
                    : new ListGroup(element, option)));

            if (option) {

                if (option.unselect)
                    list.unselect(option.unselect);

                if (option.select)
                    list.select(option.select);
            }
        });
    };

    $(function () {
        $('.list-group').listgroup();
    });
}(jQuery);
