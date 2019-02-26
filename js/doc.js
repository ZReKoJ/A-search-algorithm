'use strict'

$(() => {
    let converter = new showdown.Converter();
    $.ajax({
        url: '../md/doc.md',
        dataType: 'text',
        success: function (data) {
            $('.main').append($(
                converter.makeHtml(data)
            ));
        }
    });
});