/*
    jsHtmlToPDF.JQuery.js
    Version 1.1.0 (7/29/2016)
    
    Created by Luis Valle
    
    
    JQuery plugin/wrapper to communicate with my COORS webService
    and generate HTML to PDF. My webService uses the excellent wkhtmltopdf
    tool to convert the HTML to PDF so all credit goes to those guys...
            
    Visit www.evicore.net/jsHtmlToPDF.html for demos and setup details

*/

(function() {
    this.jsHtmlToPDF = function(options) {
        this.settings = null;
        this.dEvicore = null;
        this.dEvicore = $.Deferred();           
        
        settingsX = $.extend({
            pageStyle: '',
            myURLl: 'https://www.evicore.net/webservices/evicoreservice.asmx/postHTMLtoPDFJS',
            myCustomParams: '',
            fileName: '',
            thisSessionID: ''
        }, options );
        
        this.settings = settingsX;
    }
    
    jsHtmlToPDF.prototype.convert = function() {
        var _settings = this.settings;
        var _dEvicore = this.dEvicore;
        this.settings = null;
        this.dEvicore = null;

        _settings.waitDivElmnt = $("<div id=\"dvPDFTelWait\" style=\"position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; background-color: black;z-index:999999; " +
            "display: none;\"><form id=\"dvEvCrClone\"></form><\/div>");
                
        var tmpSettngsss = $.parseJSON(_settings.myCustomParams);
            
            if (tmpSettngsss.hasOwnProperty('fileformat')) {
                if (tmpSettngsss.fileformat == 'pdf' || tmpSettngsss.fileformat == 'doc' || tmpSettngsss.fileformat == 'xls') {
                    
                } else {
                    tmpSettngsss.fileformat = 'pdf';
                }
            } else {
                tmpSettngsss.fileformat = 'pdf';
            }
        
        var someRandomNum = ((Math.random() * 1e6) | 0);
        _settings.thisSessionID = 'WebSession_' + someRandomNum;
        _settings.fileName = ($.trim(_settings.fileName) != '' ? _settings.fileName : 'file_' + someRandomNum).replace(/\|uniqueNumber\|/g, someRandomNum);

        $(_settings.waitDivElmnt).insertAfter($(document.body).children().last());
                
        if ($.type(_settings.html) == 'string') {
            $('#dvEvCrClone').append('<div>' + _settings.html + '</div>');
        } else {
            var _xConvertToStringFields = false;
            if (tmpSettngsss.fileformat == 'doc' || tmpSettngsss.fileformat == 'xls') {
                _xConvertToStringFields = true;
            }
            
            if (_xConvertToStringFields == false) {
                $(_settings.html).clone().appendTo($('#dvEvCrClone'));
                var $tElm = $(_settings.html);
                
                var origTextAreas = $($tElm).find('textarea');
                var newTextAreas = $('#dvEvCrClone').children(":first").find('textarea');
                        
                for (var i=0; i < newTextAreas.length; i++) {
                    var orgVallll = $(origTextAreas[i]).val();
                    $(newTextAreas[i]).val('');
                    $(newTextAreas[i]).append(orgVallll);
                    //$(newTextAreas[i]).append($(origTextAreas[i]).val());
                }        
                
                var origSelects = $($tElm).find('select');
                var newSelects = $('#dvEvCrClone').children(":first").find('select');
                        
                for (var i=0; i < newSelects.length; i++) {
                    var selVal = $('option:selected', origSelects[i]).val();
                    $(newSelects[i]).find('option').each(function () {
                        var xSelVal = $(this).val();
                        if (selVal == xSelVal) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                }        
                
                $('#dvEvCrClone input:text').each(function () {
                    $(this).attr('value', $(this).val());
                });
                $("#dvEvCrClone :checked").each(function () {
                    $(this).attr('checked', 'checked');
                });
                
                /* Try to set img src's to absolute paths so wkhtmltopdf can render them correctly */
                if ($.trim(window.window.location.hostname) != '') {
                    var tmpThisProtocol = $(location).attr('protocol');
                    var tmpThisHostName = $(location).attr('hostname');
                    $('#dvEvCrClone img').each(function () {
                        if (!$(this).attr('src').match('http') && !$(this).attr('src').match('://')) {
                            $(this).attr('src', tmpThisProtocol + '//' + tmpThisHostName + '/' + $(this).attr('src'));
                        }                    
                    });
                }
                $tElm = null;
            } else {
                $(_settings.html).clone().appendTo($('#dvEvCrClone'));
                var $tElm = $(_settings.html);
                
                var origTextAreas = $($tElm).find('textarea');
                var newTextAreas = $('#dvEvCrClone').children(":first").find('textarea');
                        
                for (var i=0; i < newTextAreas.length; i++) {
                    var orgVallll = $(origTextAreas[i]).val();
                    orgVallll = orgVallll.replace(/\n/g, '<br />');
                    orgVallll = ($.trim(orgVallll) == '' ? '&nbsp;' : orgVallll);
                    //$(newTextAreas[i]).val('');
                    //$(newTextAreas[i]).append(orgVallll);
                    $(newTextAreas[i]).replaceWith('<div style="text-align:left;padding:2px;background-color:white;border:1px solid #919292;">' + orgVallll + '</div>');    
                    //$(newTextAreas[i]).append($(origTextAreas[i]).val());
                }        
                
                var origSelects = $($tElm).find('select');
                var newSelects = $('#dvEvCrClone').children(":first").find('select');
                        
                for (var i=0; i < newSelects.length; i++) {
                    var selVal = $('option:selected', origSelects[i]).val();
                    var selTxt = $('option:selected', origSelects[i]).html();
                    selTxt = ($.trim(selTxt) == '' ? '&nbsp;' : selTxt);
                    $(newSelects[i]).replaceWith('<span style="padding:2px;background-color:white;border:1px solid #919292;">' + selTxt + '</span>');
                    //$(newSelects[i]).find('option').each(function () {
                    //    var xSelVal = $(this).val();
                    //    if (selVal == xSelVal) {
                    //        $(this).attr('selected', 'selected');
                    //    }
                    //});
                }        
                
                $('#dvEvCrClone input:text').each(function () {
                    var xxVal = $(this).val();
                    xxVal = ($.trim(xxVal) == '' ? '&nbsp;' : xxVal);
                    //$(this).attr('value', $(this).val());
                    $(this).replaceWith('<span style="padding:2px;background-color:white;border:1px solid #919292;">' + xxVal + '</span>');
                });
                $("#dvEvCrClone :checkbox").each(function () {
                    var chkVall = ($(this).is(':checked') ? '&#10003;' : '&nbsp;&nbsp;');
                    //$(this).attr('checked', 'checked');
                    $(this).replaceWith('<span style="background-color:white;border:1px solid #919292;">' + chkVall + '</span>');
                });
                $("#dvEvCrClone :radio").each(function () {
                    var chkVall = ($(this).is(':checked') ? '&#10003;' : '&nbsp;&nbsp;');
                    //$(this).attr('checked', 'checked');
                    $(this).replaceWith('<span style="background-color:white;border:1px solid #919292;">' + chkVall + '</span>');
                });
                
                /* Try to set img src's to absolute paths so wkhtmltopdf can render them correctly */
                if ($.trim(window.window.location.hostname) != '') {
                    var tmpThisProtocol = $(location).attr('protocol');
                    var tmpThisHostName = $(location).attr('hostname');
                    $('#dvEvCrClone img').each(function () {
                        if (!$(this).attr('src').match('http') && !$(this).attr('src').match('://')) {
                            $(this).attr('src', tmpThisProtocol + '//' + tmpThisHostName + '/' + $(this).attr('src'));
                        }                    
                    });
                }
                $tElm = null;
            }
        }        
        
        var $tHml = (_settings.pageStyle + $('#dvEvCrClone').children().first().html()).replace(/\</g, '⌐').replace(/\>/g, '¬');
        $('#dvEvCrClone').remove();        
        _settings.html = null;
        origTextAreas = null;
        newTextAreas = null;
        origSelects = null;
        newSelects = null;
        
        $('body').append("<form method='POST' action='" + _settings.myURLl + "' style='position:fixed;top:-3333333333px;'" +
            " id='tempForm'><input" +
            " type='hidden' id='inHTML' name='inHTML' value='' /><input type='hidden'" +
            " id='properties' name='properties' value='' /><input" +
            " type='hidden' id='FileNamex' name='FileNamex' value='' /><input" +
            " type='submit' value='Submit' style='opacity:0;' class='HiddenBtn' /></form>");

            
        $('#inHTML').val($tHml);
        $('#properties').val(_settings.myCustomParams);
        $('#FileNamex').val(_settings.fileName);
        $('#tempForm').submit();

        setTimeout(function () {            
            $('#tempForm').remove();
            $('#dvPDFTelWait').remove();
            $(_settings.waitDivElmnt).remove();
            _dEvicore.resolve(true);
        }, 2000);
        
        $tHml = '';

        return _dEvicore.promise();
    }
}());

/* Support for Stringifying JSON objects for older versions of IE. Credit goes to http://blogs.sitepointstatic.com/examples/tech/json-serialization/json-serialization.js */
(function() {
    jQuery.extend({
        stringify  : function stringify(obj) {
            var t = typeof (obj);
            if (t != "object" || obj === null) {
                // simple data type
                if (t == "string") obj = '"' + obj + '"';
                return String(obj);
            } else {
                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor == Array);
     
                for (n in obj) {
                    v = obj[n];
                    t = typeof(v);
                    if (obj.hasOwnProperty(n)) {
                        if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = jQuery.stringify(v);
                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        }
    });
}());