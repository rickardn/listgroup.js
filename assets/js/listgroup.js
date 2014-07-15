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

    select = function (group, item) {
        if ($(group).data('toggle') != 'buttons')
            unselect(group);

        if (item instanceof $)
            $(item)
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
            if (config && config.toggle)
                $(group).data('toggle', config.toggle);

            $('.list-group-item', group).click(function() {
                var $item = $(this);

                select(group, $item);

                if (config && config.click)
                    config.click.apply(this);

                return false;
            });
        };

        this.each(function(i, group) {
            if ($(group).prop('tagName') === 'SELECT') {
                var $group = $(group);
                // create a list-group
                var listGroup = $('<ul class="list-group"></ul>');

                if ($group.attr('multiple'))
                    listGroup.data('toggle', 'buttons');

                $group.find('option').each(function(j, item) {
                    var html = '<a href="#" class="list-group-item" ';
                    html += 'data-value="' + $(item).val() + '">'
                         + $(item).text() + '</a>';

                    var $item = $(html);
                    listGroup.append($item);
                });

                $group.change(function(e) {
                    listGroup.listgroup({ select: $group.val() });
                });
                
                listGroup.listgroup({
                    select: $group.val(),
                    click: function () {
                        $group.val($(this).data('value'));
                    }
                });
                $group.before(listGroup);
                
            }

            if (typeof config === 'object') {

                if (config.unselect) {
                    unselect(group, config.unselect);
                }

                if (config.add) {
                    add(group, config.add);
                }

                if (config.select) {
                    select(group, config.select);
                }

                if (config.click) {
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
