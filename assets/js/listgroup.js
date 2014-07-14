// LIST GROUP PLUGIN DEFINITION
// =======================
(function ($) {
    var unselect,
        add,
        select;

    unselect = function (group, item) {
        $(group).find('.list-group-item').each(function (i, listItem) {
            $(listItem).removeClass('active');
        });
    };

    add = function(group, item) {
        $(group).append(item);
    };

    select = function (group, item) {
        if ($(group).data('toggle') != 'buttons')
            unselect(group);

        $(item)
            .addClass('active')
            .blur();
    };

    //
    $.fn.listGroup = function (config) {
        var init;

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
    
}(jQuery));
$(function () {
    $('.list-group').listGroup();
});