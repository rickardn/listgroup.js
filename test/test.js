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

    test('should toggle active', function() {
        var $listgrp = $('<ul class="list-group"/>').listgroup()
        var $item = $('<li class="list-group-item">Foo</li>')
        $listgrp
            .append($item)
            .appendTo('#qunit-fixture')
        ok(!$item.hasClass('active'), 'item does not have active class')
        $item.click()
        ok($item.hasClass('active'), 'item has class active')
    })

    test('should switch active in single selection list', function() {
        var $listgrp = $('<ul class="list-group"/>').listgroup()
        var $item1 = $('<li class="list-group-item">Foo</li>')
        var $item2 = $('<li class="list-group-item">Boo</li>')
        $listgrp
            .append($item1)
            .append($item2)
            .appendTo('#qunit-fixture')
        ok(!$item1.hasClass('active'), 'item1 does not have active class')
        ok(!$item2.hasClass('active'), 'item2 does not have active class')
        $item1.click()
        ok($item1.hasClass('active'), 'item1 has class active')
        ok(!$item2.hasClass('active'), 'item2 does not have active class')
        $item2.click()
        ok(!$item1.hasClass('active'), 'item1 does no longer have active class')
        ok($item2.hasClass('active'), 'item2 now have active class')

    })
    test('should switch active in single select anchor list group', function() {
        expect(6)
        clickOnEachItem('#anchor-listgroup1')
    })

    test('should switch active in single select ul list group', function () {
        expect(6)
        clickOnEachItem('#ul-listgroup1')
    })

    function single(collection) {
        if (collection.length != 1)
            ok(false, 'expected exactly 1 element, actually ' + collection.length)
        return collection[0]
    }

    function clickOnEachItem(selection) {
        var items = $(selection).listgroup().children()
        equal(items.filter('.active').length, 0, 'given a new list group, none is active')

        for (var i = 0; i < items.length; i++) {
            items[i].click()

            var activeItem = single(items.filter('.active'))
            deepEqual(activeItem, items[i], 'click on item ' + (i + 1) + ', only this is active')
        }
    }

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

        var $select = $('<select>_</select>')
            .append('<option style="display:none">foo</option>')
            .append('<option class="hidden">bar</option>') // class hidden must be defined as display:none
            .listgroup(),
            $listGroup = $select.siblings('.list-group')

        $listGroup.find('.list-group-item').each(function(i, item) {
            ok($(item).hasClass('hidden'), 'list group item is hidden')
        })
    })
})
