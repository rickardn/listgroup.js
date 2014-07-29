$(function () {
    'use strict';

    module('list group plugin')

    test('should be defined on jquery object', function() {
        ok($(document.body).listgroup, 'listgroup method is defined')
    })

    module('list group')

    test('should return jquery collection containing the element', function() {
        var $el = $('<div/>')
        var $listgrp = $el.listgroup()
        ok($listgrp instanceof $, 'returns jquery collection')
        strictEqual($listgrp[0], $el[0], 'collection contains element')
    })

    test('should switch active in single select anchor list group', function() {
        expect(6)
        clickOnEachItem('#anchor-listgroup1')
    })

    test('should switch active in single select ul list group', function () {
        expect(6)
        clickOnEachItem('#ul-listgroup1')
    })

    function clickOnEachItem(selection) {
        var items = $(selection).listgroup().children()
        equal(items.filter('.active').length, 0, 'given a new list group, none is active')

        for (var i = 0; i < items.length; i++) {
            items[i].click()

            var activeItem = single(items.filter('.active'))
            deepEqual(activeItem, items[i], 'click on item ' + (i + 1) + ', only this is active')
        }
    }

    function single(collection) {
        if (collection.length != 1)
            ok(false, 'expected exactly 1 element, actually ' + collection.length)
        return collection[0]
    }

    module('list group multi select')

    test('should toggle active in multi select list group', function() {
        var $listgroup = $('<ul class="list-group" data-toggle="items">')
                            .append('<li class="list-group-item">foo</li>')
                            .listgroup(),
            $item = $listgroup.find('.list-group-item');

        equal($listgroup.find('.active').length, 0, 'item is not active')
        $item.click()
        equal($listgroup.find('.active').length, 1, 'item is active')
        $item.click()
        equal($listgroup.find('.active').length, 0, 'item is not active')
    })

    module('select element')

    test('should generate list group', function () {
        function equalItems($listGroupItem, $option) {
            equal($listGroupItem.text(), $option.text(), $listGroupItem.text() + '===' + $option.text())
            equal($listGroupItem.data('value'), $option.val(), $listGroupItem.data('value') + '===' + $option.val())
        }

        var $select = $('#select1').listgroup(),
            $listGroup = $select.siblings('.list-group:first')

        $listGroup.children('.list-group-item').each(function (i, item) {
            var $option = $($select.children().get(i))
            equalItems($(item), $option)
        });
    })

    test('should update select when list group is clicked', function() {
        var $select = $('<select multiple><option>foo</option></select>').listgroup(),
            $item = $select.siblings('.list-group').find('.list-group-item')

        equal($select.val(), null, 'default value of multiple select is null')
        $item.click()
        equal($select.val(), 'foo', 'select is updated when list group was clicked')
    })

    test('should update list group when select elements change event triggers', function() {
        var $select = $('<select multiple><option>foo</option></select>').listgroup(),
            $item = $select.siblings('.list-group').find('.list-group-item')

        ok(!$item.hasClass('active'), 'no items are selected by default')
        $select.val('foo')
        $select.change()
        ok($item.hasClass('active'), 'list group is updated when select element was changed')
    })

    test('should generate multi select list group', function () {
        var $select = $('#select2').listgroup(),
            $listGroup = $select.siblings('.list-group:first')

        equal($listGroup.data('toggle'), 'items', 'list group is multi select')
    })

    test('should generate disabled list group items', function() {
        var $select = $('<select><option disabled>foo</option></select>').listgroup(),
            $listGroup = $select.siblings('.list-group')

        ok($listGroup.find('.list-group-item').hasClass('disabled'), 'list group item is disabled')
    })

    test('should genereate hidden list group items', function () {
        expect(2)

        var $div = $('<div>')

        var $select = $('<select>_</select>')
            .append('<option style="display:none">foo</option>')
            .append('<option class="hidden">bar</option>') // any class works as long as its defined as display:none

        $div.append($select)
            .appendTo('#qunit-fixture')

        $select.listgroup()

        var $listGroup = $select.siblings('.list-group')

        $listGroup.find('.list-group-item').each(function(i, item) {
            ok($(item).hasClass('hidden'), 'list group item is hidden')
        })
    })

    module('javascript api')

    test('should set multiple select with toggle option', function() {
        var $listgroup = $('<ul class="list-group"><li class="list-group-item">foo</li></ul>')
            .listgroup({toggle: 'items'})

        equal($listgroup.data('toggle'), 'items', 'multiple select is enabled')
    })

    module('javascript api select element')

    test('should select single item by value', function () {
        expect(1)

        var $select = $('<select multiple>_</select>')
                        .append('<option value="1">foo</option>')
                        .append('<option value="2">foo</option>')
                        .listgroup({ select: "1" })

        var $listgroup = $select.siblings('.list-group')

        $listgroup.find('.list-group-item.active').each(function (i, item) {
            ok($(item).hasClass('active'), 'item ' + $(item).data('value') + ' is selected by selection')
        })
    })

    test('should select multiple items by value', function () {
        expect(2)

        var $select = $('<select multiple>_</select>')
                        .append('<option value="1">foo</option>')
                        .append('<option value="2">foo</option>')
                        .listgroup({ select: ["1", "2"] })

        var $listgroup = $select.siblings('.list-group')

        $listgroup.find('.list-group-item.active').each(function (i, item) {
            ok($(item).hasClass('active'), 'item ' + $(item).data('value') + ' is selected by selection')
        })
    })

    test('should select single item by selection', function () {
        expect(1)

        var $select = $('<select multiple>_</select>')
                        .append('<option value="1">foo</option>')
                        .append('<option value="2">foo</option>')

        $select.listgroup({ select: $select.find('option:last') })

        var $listgroup = $select.siblings('.list-group')

        $listgroup.find('.list-group-item.active').each(function (i, item) {
            ok($(item).hasClass('active'), 'item ' + $(item).data('value') + ' is selected by selection')
        })
    })

    test('should select multiple items by selection', function () {
        expect(2)

        var $select = $('<select multiple>_</select>')
                        .append('<option value="1">foo</option>')
                        .append('<option value="2">foo</option>')

        $select.listgroup({ select: $select.find('option') })

        var $listgroup = $select.siblings('.list-group')

        $listgroup.find('.list-group-item').each(function (i, item) {
            ok($(item).hasClass('active'), 'item ' + $(item).data('value') + ' is selected by selection')
        })
    })

    test('should unselect single item by value', function () {
        var $select = $('<select multiple>_</select>')
                        .append('<option value="1" selected>foo</option>')
                        .append('<option value="2">foo</option>')
                        .listgroup()
                        
        var $listgroup = $select.siblings('.list-group')

        equal($listgroup.find('.list-group-item.active').length, 1, 'first item is selected')

        $select.listgroup({ unselect: "1" })

        equal($listgroup.find('.list-group-item.active').length, 0, 'first item is unselected')
    })

    test('should unselect multiple items by value', function () {
        var $select = $('<select multiple>_</select>')
                        .append('<option value="1" selected>foo</option>')
                        .append('<option value="2" selected>foo</option>')
                        .listgroup()

        var $listgroup = $select.siblings('.list-group')

        equal($listgroup.find('.list-group-item.active').length, 2, 'all items are selected')

        $select.listgroup({ unselect: ["1", "2"] })

        equal($listgroup.find('.list-group-item.active').length, 0, 'all item are unselected')
    })
})
