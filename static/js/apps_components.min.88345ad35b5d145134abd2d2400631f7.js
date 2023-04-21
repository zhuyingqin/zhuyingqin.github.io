$(document).ready(function(){
	// append the signin link with the current url.
	var currenturl = encodeURIComponent(window.location.href);
	var signinlink =$('#mn-signin-link'); 
	var baseHref = signinlink.attr("href");
	var xploreLogoutUrl = $('#xploreLogoutUrl').text();
	var signInUrl = null;
	if(typeof baseHref != 'undefined' && (baseHref.indexOf("=") == (baseHref.length - 1))){
		signInUrl = baseHref + currenturl;
		$('a.sign-in-cls').attr("href", signInUrl);
	}
	
	//append the current url to the create account link. 
	var calink = $('#mn-calink-link'); 
	var caBaseHref = calink.attr("href");
	if(typeof caBaseHref != 'undefined' && (caBaseHref.indexOf("=") == (caBaseHref.length - 1))){
		calink.attr("href", caBaseHref + currenturl + "&ShowMGAMarkeatbilityOptIn=true");
	}

	var metaNavHeight = $('#meta-nav').height();
	var spinnerTopMargin = (metaNavHeight - $("#user-info-spinner").height()) / 2;
	$("#user-info-spinner").css('margin-top', spinnerTopMargin);
	$("#user-info-spinner").removeClass("hidden");
	// Get the quote count from the service and update it.
	$.ajax({
		crossDomain: true,
		dataType: "json",
		xhrFields: {
			withCredentials: true
		},
	    url: '/bin/svc/ieeecommon/core/quote/v1/get-quote.dynamic-metanav.json', 
	    type: "POST",
		cache: false,
	    data: "",
	    success: function (result) {
	    	if (result && result.success) {
	    		if (result.data !== null) {
	    			$('.cart-items-count').html(result.data.cartItemCount);
	    			if (typeof result.data.userName !== 'undefined' && null != result.data.userName) {
	    				$("#mn-user-name-text").text(result.data.userName);
	    				$(".anonymous-metanav-info").hide();
	    				if ((typeof result.data.webAccountUser !== 'undefined') && (result.data.webAccountUser === false)) {							
	    					$(".cart-count-link").hide();
	    				} else {
	    					$(".cart-count-link").show();
	    					if ($("#rc-cart-checkout").length) {
	    						if (result.data.cartItemCount > 0) {
	    							$("#rc-cart-checkout").removeClass("hidden");
	    						}
	    						$("#rc-purchases").removeClass("hidden");
	    					}
	    				}
	    				$(".logged-in-metanav-info").show();
    					SSOValidator.execute(true, null, result.data.webAccountUser);
	    			} else {
	    				$(".anonymous-metanav-info").show();
	    				$(".logged-in-metanav-info").hide();
    					SSOValidator.execute(false, signInUrl);
	    			}
	    			$("#user-info-spinner").addClass("hidden");
	    			$("#user-info").removeClass("hidden");
	    		} 
	        } else{
        		console.log(result);
	        }
	    },
	    error: function (e) {
	       console.log(e);
	    }
	});
	
	if (null != xploreLogoutUrl && '' != xploreLogoutUrl && $('#mn-signout-link').length) {
		$('#mn-signout-link').on('click', function(event) {
			event.preventDefault();
			$.ajax({
				url: xploreLogoutUrl,
				type: "GET",
				dataType: "jsonp",
				jsonpCallback: function(data) {
					window.location = $('#mn-signout-link').attr("href");
				},
				success: function(data) {
					//no need to do anything here!
				}
			});
		});
	}
	
	var showcart = getUrlParameter("dc");
	if(showcart == "false"){
		$(".cart-count-link").remove();
	}
	
});

var SSOValidator = {
	execute: function (isLoggedIn, signInUrl, isWebAcctUser) {
		if ($('#ssoValidatorUrl').length && !SSOValidator.getCookie('wcmmode')) {
			var ssoValidatorUrl = $('#ssoValidatorUrl').text();
			$.ajax({
				crossDomain: true,
				dataType: "json",
				url: ssoValidatorUrl,
				cache: false,
				xhrFields: {
					withCredentials: true
				},
				success: function (result) {
					if (!isLoggedIn && (typeof result == 'object' && result.cookieValid 
							&& (typeof isWebAcctUser == 'undefined' || isWebAcctUser))) { 		//SSO
						window.location = signInUrl;
					} else if (isLoggedIn && (typeof result == 'object' && !result.cookieValid) 
							&& (typeof isWebAcctUser !== 'undefined' && isWebAcctUser)) {		//SLO

						var signOutLink = $('#mn-signout-link').attr("href");
						window.location = signOutLink;
					}
				},
				error: function (e) {
					console.debug(e);
				}
			});
		}
	},
	getCookie : function(cname) {
	    var name = cname + "=";
	    var decodedCookie = decodeURIComponent(document.cookie);
	    var ca = decodedCookie.split(';');
	    for(var i = 0; i <ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return "";
	}
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

jQuery(document).ready(function() {

    jQuery('#expand-all').on('click', function(e) {
        e.preventDefault();
        for(i=0;i<100;i++) {
            expand(i);
        }
    });

    jQuery('#collapse-all').on('click', function(e) {
        e.preventDefault();
        for(i=0;i<100;i++) {
            collapse(i);
        }
    });

    jQuery('#downloadpdf').on('click', function(e) {
        e.preventDefault();
        $('#pdf-dropdown').toggle();
    });

    jQuery('#download-fullpdf').on('click', function(e) {
		var postcontent = "pdfMode=full&componentPath=" + $("#compare-features").attr("data-path");
		var downloadPdfUrl = '/bin/ieeeorg/publications/subscriptions/compare-features?' + postcontent;
		
		window.open(downloadPdfUrl, '_compare_chart_download');
    });

	jQuery('#generate-currentpdf').on('click', function(e) {
		var postcontent = "pdfMode=current&expandedRows=1";
        $(".expanded").each(function( index ) {
			var expid = $(this).attr("id");
            var expandedid = expid.substring(12);
            postcontent = postcontent + "," + expandedid;
		});
		postcontent = postcontent + "&componentPath=" + $("#compare-features").attr("data-path");
		var downloadPdfUrl = '/bin/ieeeorg/publications/subscriptions/compare-features?' + postcontent;

		window.open(downloadPdfUrl, '_compare_chart_download');
    });
});

function expand(num) {
    jQuery('#expandedrow-'+num).show();
    jQuery('#collapsedrow-'+num).hide();
	jQuery('#expandedrow-'+num).addClass("expanded");
}

function collapse(num) {
    jQuery('#expandedrow-'+num).hide();
    jQuery('#collapsedrow-'+num).show();
    jQuery('#expandedrow-'+num).removeClass("expanded");
}
jQuery(document).ready(function() {
    $("#tabhead-0").click(); // just select the first tab after loading the page.
});

$(document).ready(function(){
    var searchengid = $("#search-engine-id").val();
    var searchtipsPagepath = $("#seacrh-tips-page-path-id").val();
    if (searchtipsPagepath == null || searchtipsPagepath == undefined) {
        searchtipsPagepath = "#";
    }
    if (searchengid != null && searchengid != undefined) {
        var cx = searchengid;
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);

        google.setOnLoadCallback(function() {

                var cse = new google.search.CustomSearchControl(searchengid);
                cse.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
                cse.setRefinementStyle(google.search.SearchControl.REFINEMENT_AS_LINK);

                cse.setLinkTarget(google.search.Search.LINK_TARGET_SELF);

                var drawOptions = new google.search.DrawOptions();

                drawOptions.setDrawMode(google.search.SearchControl.DRAW_MODE_LINEAR);

                drawOptions.enableSearchResultsOnly();

                var queryFromUrl = parseQueryFromUrl();
                var queryFromUrlHtml = queryFromUrl.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
                var refinementsRegd = false;
                var searcherLocal;
                cse.setSearchCompleteCallback(this, function(sc, searcher) {
                    searcherLocal = searcher;

                    formatNoResultsMessage(queryFromUrlHtml); //reformat no results message
                    formatRefinementsDisplay(queryFromUrlHtml); //reformat refinements display
                    formatResultsInfoDisplay(searcher, queryFromUrlHtml); //reformat results info display

                });

                cse.draw('cse-search-results', drawOptions);
                if (queryFromUrl) {
                    cse.execute(queryFromUrl);
                }
            },
            true);

        function parseQueryFromUrl() {
            var queryParamName = "q";
            var search = window.location.search.substr(1);
            var parts = search.split('&');
            for (var i = 0; i < parts.length; i++) {
                var keyvaluepair = parts[i].split('=');
                if (decodeURIComponent(keyvaluepair[0]) == queryParamName) {
                    return decodeURIComponent(keyvaluepair[1].replace(/\+/g, ' '));
                }
            }
            return '';
        }

        function formatRefinementsDisplay(searchString) {
            if ($('.gsc-refinementsArea').length > 0) {
                if ($('.gsc-refinementLabel').length <= 0) {
                    var parent = $('.gsc-refinementsArea')[0];
                    var children = parent.children;
                    var child1 = children[0];
                    var grandChildren = child1.children;

                    for (var ind = 0; ind < grandChildren.length; ind++) {
                        parent.appendChild(grandChildren[ind]);
                    }
                    parent.removeChild(child1);

                    $('.gsc-refinementsArea').prepend('<div class="gsc-refinementLabel">Refine results for: <b>' + searchString + '</b></div>');
                }
            }
        }

        (function($) {
            $.fn.available = function(expr, callback) {
                var evtType = 'DOMSubtreeModified';
                return this.each(function() {
                    var $this = $(this),
                        found = $this.find(expr)[0];
                    if (found) return callback(found);

                    var handler = function(e) {
                        found = $this.find(expr)[0];
                        if (found) {
                            $this.unbind(evtType, handler);
                            callback(found);
                        }
                    };
                    $this.bind(evtType, handler);
                });
            };
        })(jQuery);

        function formatResultsInfoDisplay(searcher, queryFromUrl) {
            if ($('.gsc-result-info').length > 0 && searcher.cursor != null) {
                jQuery('.gsc-control-wrapper-cse').available('.gsc-above-wrapper-area', function(el) {
                    var numPrevResults = searcher.cursor.currentPageIndex * searcher.getNumResultsPerPage();
                    var numTotResults = searcher.cursor.estimatedResultCount;
                    var resultInfoDiv = $('div.gsc-tabdActive div.gsc-result-info')[0];
                    if ($(resultInfoDiv).length > 0) {
                        resultInfoDiv.innerHTML = "Showing " + (numPrevResults + 1) + " - " + ((numTotResults - numPrevResults) > 10 ? (numPrevResults + 10) : numTotResults) + " of " + searcher.cursor.resultCount + " for " + queryFromUrl + " (" + searcher.cursor.searchResultTime + " seconds)";
                    } else {
                        var customMsg = "Showing " + (numPrevResults + 1) + " - " + ((numTotResults - numPrevResults) > 10 ? (numPrevResults + 10) : numTotResults) + " of " + searcher.cursor.resultCount + " for " + queryFromUrl + " (" + searcher.cursor.searchResultTime + " seconds)";
                        $('.gsc-tabdActive').prepend('<div class="gsc-above-wrapper-area2"><table cellspacing="0" cellpadding="0" class="gsc-above-wrapper-area-container"><tbody><tr><td class="gsc-result-info-container"><div class="gsc-result-info" id="resInfo-0">' + customMsg + '</div></td></tr></tbody></table></div>');
                    }
                });
                $('.gsc-above-wrapper-area').hide();
            }
        }

        function formatNoResultsMessage(searchString) {

            if ($('.gs-no-results-result').length > 0) {
                $('.gsc-above-wrapper-area')[0].style.border = 'none';
                var customMesg =
                    '<p>Your search - <b>' + searchString + '</b> did not match any documents.</p>' +
                    '<p>Suggestions: <br/>' +
                    '<ul>' +
                    '	<li>Make sure all words are spelled correctly.</li>' +
                    '	<li>Try different keywords.</li>' +
                    '	<li>Try more general keywords.</li>' +
                    '	<li>Try fewer keywords.</li>' +
                    '</ul></p>' +
                    '<p class="arrow-link"><a href=' + searchtipsPagepath + '>View more search tips</a></p>';
                $('.gs-no-results-result').html('<div class="gs-snippet">' + customMesg + '</div>');
            }
        }
    }
});

jQuery(document).ready(function() {


    jQuery('.expcol-expand-all').on('click', function(e) {

     var openIconClass =   $(this).closest('.button-container').find('input#open').val();
     var closeIconClass =  $(this).closest('.button-container').find('input#close').val();
        e.preventDefault();
        $(this).closest('.button-container').find('.eccontentrow').show();
        $(this).closest('.button-container').find('.ectitlerow').addClass("expanded").removeClass("collapsed");
        $(this).closest('.button-container').find('.ectitlerow span>i').removeClass(closeIconClass).addClass(openIconClass);

    });

    jQuery('.expcol-collapse-all').on('click', function(e) {

       var openIconClass =   $(this).closest('.button-container').find('input#open').val();
       var closeIconClass =  $(this).closest('.button-container').find('input#close').val();
        e.preventDefault();
        $(this).closest('.button-container').find('.eccontentrow').hide();
        $(this).closest('.button-container').find('.ectitlerow').addClass("collapsed").removeClass("expanded");
        $(this).closest('.button-container').find('.ectitlerow span>i').removeClass(openIconClass).addClass(closeIconClass);
    });

    jQuery('.ectitlerow').on('click', function(e) {
        var id = jQuery(this).attr("id");
        var id2 = id.substring(10);
        var openIconClass =   $(this).closest('.button-container').find('input#open').val();
        var closeIconClass =  $(this).closest('.button-container').find('input#close').val();	

        if(jQuery(this).hasClass("expanded")){
        	$(this).next().hide();
            $(this).addClass("collapsed").removeClass("expanded");
            $(this).find("span>i").removeClass(openIconClass).addClass(closeIconClass);

        } else {
        	 $(this).next().show(); 
             $(this).addClass("expanded").removeClass("collapsed");
             $(this).find("span>i").removeClass(closeIconClass).addClass(openIconClass);
        }
		
    });
});


jQuery(document).ready(function() {
	
	jQuery('#duessubmit').on('click', function(e) {
		
		//do nothing if the button is disabled
		if($(this).hasClass("disabled")){
			return;
		}
		$("#membershipduesresult").empty();
		$("#loading-spinner").show();
		$("#status-msg").hide();
		$("#error-div").hide();
		
		var country = $("#country option:selected").val();
		var career = $("#careerphase").val().trim();
		var validSubmission = true;
		var errordescription = $("<ul class='error-description'></ul>");
		if(country === 'none'){
			$("#country").addClass("red-border");
			validSubmission = false;
			errordescription.append("<li>Please select the country.</li>");
		}
		if(career === ''){
			$("#careerphase").addClass("red-border");
			errordescription.append("<li>Please select the career phase.</li>");
			validSubmission = false;
		}
		if(validSubmission){
			var getURL = "/bin/ieeeorg/membership/join/dynamicdues?country="+country+"&careerPhase="+career;
			$.ajax({
				method: "GET",
				url: getURL,
				success: function(data, status, xhttp){
					$("#loading-spinner").hide();
					console.log(data); 
					if(data.country != undefined && data.country != ""){
						var table = $('<table></table>').addClass('dues-result-table');
						var header = $('<tr class="dues-result-header"><td>Country</td><td>Career Phase</td><td>Price</td></tr>');
						var row = "<tr class='dues-data-row'><td>" + data.country + "</td><td>" + data.careerPhase + "</td><td>" + data.dues + "</td></tr>";
				        table.append(header);
				        table.append(row);
						$("#membershipduesresult").append(table);
                        var hasNotes = false;
                        var notesTable = $('<table></table>').addClass('dues-notes-table');
                        if(data.notesHeader != undefined && data.notesHeader != ""){
                            var notesHeader = "<tr class='dues-notes-header'><td>"+ data.notesHeader +"</td></tr>";
                            notesTable.append(notesHeader);
                            hasNotes = true;
                        }
                        if(data.notesDesc1 != undefined && data.notesDesc1 !=""){
							var notesDesc = "<tr class='dues-notes-desc'><td>" + data.notesDesc1 + "</td></tr>";
                            notesTable.append(notesDesc);
                            hasNotes = true;
                        }
						if(data.notesDesc2 != undefined && data.notesDesc2 !=""){
							var notesDesc2 = "<tr class='dues-notes-desc'><td>"+ data.notesDesc2 +"</a></td></tr>";
                            notesTable.append(notesDesc2);
                            hasNotes = true;
                        }
                        if(hasNotes){
                            $("#membershipduesresult").append(notesTable);
                        }
                        //if(data.country == "Japan" && data.careerPhase == "Professional"){
                        	//var jpspecialnotes = $("<br><p><u>Price is for new members only. Renewing members pay US$183.</u></p>");
                        	//$("#membershipduesresult").append(jpspecialnotes);
                        //}
					} else {
						$("#error-div").empty().append(data).show();
					}
				},
				error: function(){
					$("#loading-spinner").hide();
					var errorMessage = $('<p style="color:red;"></p>').text("Error while fetching the dues information. Please contact feedback@ieee.org.");
					$("#error-div").empty().append(errorMessage).show();
				}
			});
		} else {
			$("#loading-spinner").hide();
			$("#error-div").empty().append(errordescription).show();
		}
    });
});

jQuery(document).ready(function() {

	jQuery('#dsrsubmitform, #dsrsubmitform2').on('click', function(e) {
		//do nothing if the button is disabled
		if($(this).hasClass("disabled")){
			return;
		}
		$("#loading-spinner").show();
		$("#dsr-status-msg").hide();
		$("#error-div").hide();
		
		var fn = $("#firstname").val().trim();
		var ln = $("#lastname").val().trim();
		var email = $("#email").val().trim();
		var validSubmission = true;
		
		var errordescription = $("<ul class='error-description'></ul>");
		if(fn.trim() === ''){
			$("#firstname").addClass("red-border");
			validSubmission = false;
			errordescription.append("<li>Please fill in the First Name field.</li>");
		}
		if(ln.trim() === ''){
			$("#lastname").addClass("red-border");
			validSubmission = false;
			errordescription.append("<li>Please fill in the Last Name field.</li>");
		}
		if(email.trim() === ''){
			$("#email").addClass("red-border");
			errordescription.append("<li>Please fill in your email address.</li>");
			validSubmission = false;
		} else {
			var isValidEmail = IsEmail(email);
			if(!isValidEmail){
				errordescription.append("<li>Email address is invalid. Please enter a valid email address.</li>");
				validSubmission = false;
			}  
		}

		var requestTypeSelected = $("input[name=requestType]:checked").val();
		if(validSubmission){
			$("#error-div").empty();
			var formValues= $("#dsrform").serialize();
	        $.post("/bin/svc/ieeecommon/core/gdpr-request.add-record.json", formValues, function(data){
	        	console.log(data);
	        	$("#submittedemailaddress").text(email);
	        	$("#dsr-form-section1").hide();
	        	$("#dsr-form-section-req").hide();
				$("#dsr-form-section2").hide();
				$("#dsr-form-section3").hide();
				$("#warning-div").hide();
				$("#loading-spinner").hide();
				if(requestTypeSelected === "request_something_other"){
					$("#success-msg-body").empty().append("<span>Thank you for your request.  We will review and respond to your request promptly.</span>");
				}
	        	$("#dsr-status-msg").show();
	        });
		} else {
			$("#error-div").empty();
			var ptag = $("<p></p>").text("Please fill in the following required information.");
			$("#error-div").append(ptag);
			
			$("#error-div").append(errordescription);
			$("#error-div").show();
			$("#loading-spinner").hide();
			$('html, body').animate({scrollTop: $("#error-div").offset().top}, 400);
		}
    });
	
	$("#next" ).click(function() {
		var option = $("input[name=requestType]:checked").val();
		console.log("Optionnnn : " + option);
		if(option == undefined){
			var ptag = $("<p></p>").text("Please select an option to continue.");
			$("#error-div").empty().append(ptag);
			$("#error-div").show();
			return;
		} else {
			$("#error-div").empty();
			$("#error-div").hide();
		}
		if(option == "need_information" || option == "delete_my_data"){
			$("#dsr-form-section1").hide();
			$("#dsr-form-section-req").show();
			$("#dsr-form-section2").show();
			$("#dsr-form-section3").hide();			
		} else if(option == "request_something_other"){
			$("#dsr-form-section1").hide();
			$("#dsr-form-section-req").show();
			$("#dsr-form-section2").hide();
			$("#dsr-form-section3").show();
		} else {
			window.location.href = "https://www.ieee.org/ieee-privacyportal/app/managePreferences";
		}
	});
	
	$("#back1, #back2").click(function() {
		$("#dsr-form-section1").show();
		$("#dsr-form-section-req").hide();
		$("#dsr-form-section2").hide();
		$("#dsr-form-section3").hide();
	});
	
	$("#firstname").keypress(function() {
		if($(this).val().trim() != '') {
			$(this).removeClass("red-border");
		} else {
			$(this).addClass("red-border");
		}
	});
	$("#lastname").keypress(function() {
		if($(this).val().trim() != '') {
			$(this).removeClass("red-border");
		} else {
			$(this).addClass("red-border");
		}
	});
	$("#email").keypress(function() {
		if($(this).val().trim() != '') {
			$(this).removeClass("red-border");
		} else {
			$(this).addClass("red-border");
		}
	});
	$(".dsr-checkbox").change(function() {
	    if(this.checked) {
	    	let cid = $(this).attr("id");
	    	let fid = cid.substring(3);
	    	$( "#" + fid ).prop("disabled", false);
	    	if(fid == "othername"){
	    		$( "#otheremail").prop("disabled", false);
	    	}
	    } else {
	    	let cid = $(this).attr("id");
	    	let fid = cid.substring(3);
	    	$( "#" + fid ).prop("disabled", true);
	    	if(fid == "othername"){
	    		$( "#otheremail").prop("disabled", true);
	    	}
	    }
	});
	function IsEmail(email) {
		var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(!regex.test(email)) {
			return false;
		} else {
			return true;
		}
	}
	
});
jQuery(document).ready(function() {

	var USStates= [{"name":"Alabama","code":"AL"},
		{"name":"Alaska","code":"AK"},
		{"name":"Arizona","code":"AZ"},
		{"name":"Arkansas","code":"AR"},
		{"name":"California","code":"CA"},
		{"name":"Colorado","code":"CO"},
		{"name":"Connecticut","code":"CT"},
		{"name":"Delaware","code":"DE"},
		{"name":"District of Columbia","code":"DC"},
		{"name":"Florida","code":"FL"},
		{"name":"Georgia","code":"GA"},
		{"name":"Hawaii","code":"HI"},
		{"name":"Idaho","code":"ID"},
		{"name":"Illinois","code":"IL"},
		{"name":"Indiana","code":"IN"},
		{"name":"Iowa","code":"IA"},
		{"name":"Kansa","code":"KS"},
		{"name":"Kentucky","code":"KY"},
		{"name":"Lousiana","code":"LA"},
		{"name":"Maine","code":"ME"},
		{"name":"Maryland","code":"MD"},
		{"name":"Massachusetts","code":"MA"},
		{"name":"Michigan","code":"MI"},
		{"name":"Minnesota","code":"MN"},
		{"name":"Mississippi","code":"MS"},
		{"name":"Missouri","code":"MO"},
		{"name":"Montana","code":"MT"},
		{"name":"Nebraska","code":"NE"},
		{"name":"Nevada","code":"NV"},
		{"name":"New Hampshire","code":"NH"},
		{"name":"New Jersey","code":"NJ"},
		{"name":"New Mexico","code":"NM"},
		{"name":"New York","code":"NY"},
		{"name":"North Carolina","code":"NC"},
		{"name":"North Dakota","code":"ND"},
		{"name":"Ohio","code":"OH"},
		{"name":"Oklahoma","code":"OK"},
		{"name":"Oregon","code":"OR"},
		{"name":"Pennsylvania","code":"PA"},
		{"name":"Rhode Island","code":"RI"},
		{"name":"South Carolina","code":"SC"},
		{"name":"South Dakota","code":"SD"},
		{"name":"Tennessee","code":"TN"},
		{"name":"Texas","code":"TX"},
		{"name":"Utah","code":"UT"},
		{"name":"Vermont","code":"VT"},
		{"name":"Virginia","code":"VA"},
		{"name":"Washington","code":"WA"},
		{"name":"West Virginia","code":"WV"},
		{"name":"Wisconsin","code":"WI"},
		{"name":"Wyoming","code":"WY"},
		{"name":"Armed Forces - Central and South Americas","code":"AA"},
		{"name":"Armed Forces - Canada, Europe, Middle East, and Africa","code":"AE"},
		{"name":"Armed Forces Pacific","code":"AP"},
		{"name":"American Samoa","code":"AS"},
		{"name":"Federated States of Micronesia","code":"FM"},
		{"name":"Guam","code":"GU"},
		{"name":"U.S. Virgin Islands","code":"VI"},
		{"name":"Northern Mariana Islands, Commonwealth of","code":"MP"},
		{"name":"Marshall Islands","code":"MH"}];
	
	var CAProvinces = [{"name": "Alberta","code": "AB"},
		{"name": "British Columbia","code": "BC"},
		{"name": "Manitoba","code": "MB"},
		{"name": "New Brunswick","code": "NB"},
		{"name": "Newfoundland and Labrador","code": "NL"},
		{"name": "Northwest Territories","code": "NT"},
		{"name": "Nova Scotia","code": "NS"},
		{"name": "Nunavut","code": "NU"},
		{"name": "Ontario","code": "ON"},
		{"name": "Prince Edward Island","code": "PE"},
		{"name": "Quebec","code": "QC"},
		{"name": "Saskatchewan","code": "SK"},
		{"name": "Yukon Territory",	"code": "YT"}]
	
	jQuery('#submitform').on('click', function(e) {
		
		//do nothing if the button is disabled
		if($(this).hasClass("disabled")){
			return;
		}
		$("#loading-spinner").show();
		$("#status-msg").hide();
		$("#error-div").hide();
		
		var fn = $("#firstname").val().trim();
		var mn = $("#middlename").val().trim();
		var ln = $("#lastname").val().trim();
		var country = $("#country").val();
		var state = $("#state").val();
		var memno = $("#memberno").val();
		var email = $("#email").val();
		var expenseUserResponse = "N";
		if($("input[name='expenseUser']:checked").val() == "Y"){
			expenseUserResponse = "Y";
		}
		var travelUserResponse = "N";
		if($("input[name='travelUser']:checked").val() == "Y"){
			travelUserResponse = "Y";
		}
		
		var validSubmission = true;
		var errordescription = $("<ul class='error-description'></ul>");
		if(fn === ''){
			$("#firstname").addClass("red-border");
			validSubmission = false;
			errordescription.append("<li>Please fill in the First Name field.</li>");
		}
		if(ln === ''){
			$("#lastname").addClass("red-border");
			validSubmission = false;
			errordescription.append("<li>Please fill in the Last Name field.</li>");
		}
		if(country === 'none'){
			$("#country").addClass("red-border");
			validSubmission = false;
			errordescription.append("<li>Please select your country of residence.</li>");
		} else if(country === 'US' || country === 'CA'){
			if(state === 'none'){
				validSubmission = false;
				errordescription.append("<li>Please select your State/Province.</li>");
			}
		}
		if(memno === ''){
			$("#memberno").addClass("red-border");
			errordescription.append("<li>Please fill in your member number.</li>");
			validSubmission = false;
		}
		if(email === ''){
			$("#email").addClass("red-border");
			errordescription.append("<li>Please fill in your email address.</li>");
			validSubmission = false;
		}
		if(expenseUserResponse === 'N' && travelUserResponse === 'N'){
			//$("#fieldset-l").addClass("legend-red-border");
			$("#options-div").addClass("options-error");
			validSubmission = false;
			errordescription.append("<li>Please select <b>Yes</b> for at least one of the options - Expense Reimbursement / Travel Reservations.</li>");
		}
		if(validSubmission){
			var formdata = "";
			formdata = formdata + "firstName="+fn;
			formdata = formdata + "&middleName="+mn;
			formdata = formdata + "&lastName="+ln;
			formdata = formdata + "&countryCode="+country;
			formdata = formdata + "&stateCode="+state;
			formdata = formdata + "&memberno="+memno;
			formdata = formdata + "&email="+email;
			formdata = formdata + "&expenseUser="+expenseUserResponse;
			formdata = formdata + "&travelUser="+travelUserResponse;
			var getURL = "/bin/svc/ieeecommon/core/concur-user.add-record.json?" + formdata;

			$("#error-div").empty();
			$.ajax({
				method: "GET",
				url: getURL,
				success: function(data, status, xhttp){
					$("#loading-spinner").hide(); 
					if(data.success){
						// Redirect the user to the Thank you Page.
						window.location.href = "https://www.ieee.org/about/volunteers/concur-registration-thank-you.html";
					} else {
						$("#error-div").empty();
						$("#status-msg").empty();
						var errorMessage = data.errorMsg;
						$("#status-msg").append(errorMessage);
						$("#status-msg").show();
					}
				},
				error: function(){
					$("#error-div").empty();
					$("#status-msg").empty();
					var errorMessage = $('<p style="color:red;"></p>').text("Error while updating your Concur access request. Please contact concurfeedback@ieee.org.");
					$("#status-msg").append(errorMessage);
					$("#loading-spinner").hide();
					$("#status-msg").show();
				}
			});
		} else {
			$("#error-div").empty();
			var ptag = $("<p></p>").text("Please fill in the following required information.");
			$("#error-div").append(ptag);
			
			$("#error-div").append(errordescription);
			$("#error-div").show();
			$("#loading-spinner").hide();
			$('html, body').animate({
                scrollTop: $("#error-div").offset().top
            }, 400);
		}
    });
	
	$("#firstname").keypress(function() {
		if($(this).val().trim() != '') {
			$(this).removeClass("red-border");
		} else {
			$(this).addClass("red-border");
		}
	});
	$("#lastname").keypress(function() {
		if($(this).val().trim() != '') {
			$(this).removeClass("red-border");
		} else {
			$(this).addClass("red-border");
		}
	});
	$( "#country").change(function() {
		let cntry = $(this).val();
		if(cntry == "none"){
			$(this).addClass("red-border");
		} else {
		  $(this).removeClass("red-border");
		  // CONCUR ENHANCEMENT
		  let options = [];
		  let isUSCA = false;
		  if(cntry == "US"){
			  options = USStates
			  isUSCA = true;
			  $.each(CAProvinces, function(key, province) { 
				  $("#state > option").each(function() {
					    if(this.value == province.code){
					    	$(this).hide();
					    }
				});
			  });
			 $.each(USStates, function(key, province) { 
				  $("#state > option").each(function() {
					    if(this.value === province.code){
					    	$(this).show();
					    }
				});
			  });
		  } else if(cntry == "CA") {
			  $.each(USStates, function(key, province) { 
				  $("#state > option").each(function() {
					    if(this.value=== province.code){
					    	$(this).hide();
					    }
				});
			  });
			 $.each(CAProvinces, function(key, province) { 
				  $("#state > option").each(function() {
					    if(this.value == province.code){
					    	$(this).show();
					    }
				});
			  });
			  isUSCA = true;
		  }
		  if(isUSCA == true){
			  //$('#state').empty();
			  //$('#state').append($("<option></option>").attr("value", "none").text("Select the State/Province"));
			  //$.each(options, function(key, value) {
				  //$('#state').append($("<option></option>").attr("value", value.code).text(value.name)); 
			  //});
			  $('#statsprovincediv').show();
		  } else {
			  $('#statsprovincediv').hide();
		  }
		  
	  }
	});
	
	// CONCUR ENHANCEMENT
	//for the first time on load.
	let cnty = $("#country").val();
	var sp = [];
	let isNA = false;
	if(cnty == "US"){
		sp = USStates;
		isNA = true;
		 $.each(CAProvinces, function(key, province) { 
			  $("#state > option").each(function() {
				    if(this.value == province.code){
				    	$(this).hide();
				    }
			});
		  });
		 $.each(USStates, function(key, province) { 
			  $("#state > option").each(function() {
				    if(this.value === province.code){
				    	$(this).show();
				    }
			});
		  });
	} else if(cnty == "CA") {
		sp = CAProvinces;
		isNA = true;
		 $.each(USStates, function(key, province) { 
			  $("#state > option").each(function() {
				    if(this.value === province.code){
				    	$(this).hide();
				    }
			});
		  });
		 $.each(CAProvinces, function(key, province) { 
			  $("#state > option").each(function() {
				    if(this.value == province.code){
				    	$(this).show();
				    }
			});
		  });
	}
	if(isNA == true){
		/*$('#state').empty();
		$('#state').append($("<option></option>").attr("value", "none").text("Select the State/Province"));
		$.each(sp, function(key, value) {
			$('#state').append($("<option></option>").attr("value", value.code).text(value.name)); 
		});*/
		$('#statsprovincediv').show();
	} else {
		$('#statsprovincediv').hide();
	}
	
	$("input[name='expenseUser']").change(function() {
	  if($("input[name='expenseUser']:checked").val() == "Y"){
		  //$("#fieldset-l").removeClass("legend-red-border");
		  $("#options-div").removeClass("options-error");
	  } else if($("input[name='travelUser']:checked").val() == "N"){ // If both the check boxes are unchecked, show the red warning.
		  //$("#fieldset-l").addClass("legend-red-border");
		  $("#options-div").addClass("options-error");
	  }
	});
	$("input[name='travelUser']").change(function() {
	  if($("input[name='travelUser']:checked").val() == "Y"){
		  //$("#fieldset-l").removeClass("legend-red-border");
		  $("#options-div").removeClass("options-error");
	  } else if($("input[name='expenseUser']:checked").val() == "N"){ // If both the check boxes are unchecked, show the red warning.
		  //$("#fieldset-l").addClass("legend-red-border");
		  $("#options-div").addClass("options-error");
	  }
	});
});
jQuery(document).ready(function() {
	
	jQuery('#casubmitform').on('click', function(e) {
		//do nothing if the button is disabled
		if($(this).hasClass("disabled")){
			return;
		}
		$("#loading-spinner").show();
		$("#ca-status-msg").hide();
		$("#error-div").hide();
		
		$("#error-div").empty();
		var formValues= $("#capetitionform").serialize();
        $.post("/bin/svc/ieeecommon/core/ca-petitions.add-record.json", formValues, function(data,status,xhr){
        	console.log("Got the response");
            console.log(data);
        }).done(function() {
        }).fail(function(jqxhr, settings, ex) { 
        	
        });

    	$("#capetitionform").hide();
    	$("#concur-form-container").hide();
		$("#ca-status-msg").show();
		$(".pagetitle").hide();
		
		$("#loading-spinner").hide();
    });
});

$(function() {
    //generating json object from response
    if ($('#calendar').size() > 0) {
        var eventsData = function() {
            var jsonTemp = null;
            $.ajax({
                'async': false,
                'url': $("#eventDetailsServletPath")[0].value.concat('?calendarEventBasePath').concat('=').concat($("#basePath")[0].value),
                'dataType': 'JSON',
                'success': function(data) {
                    jsonTemp = data;
                }
            });
            return jsonTemp;
        }();
        var events = [],
            filterObj = '',
            itemNo = 0,
            eventData = {},
            currentTime = new Date(),
            getMonth = currentTime.getMonth() + 1,
            getYear = currentTime.getFullYear(),
            currentMonthYear = getYear + '-' + getMonth,
            eventsResponseData;
        //generating month-wise events from JSON response array
        function getCurrentMonthEvents(currentMonthYear) {
            for (var i = 0; i < eventsData.data.length; i += 1) {
                var result = eventsData.data[i];
                if (result.monthyear === currentMonthYear) {
                    events = [];
                    eventsResponseData = result.eventList;
                    for (var i in eventsResponseData.eventItems) {
                        var item = eventsResponseData.eventItems[i];
                        events.push({
                            'eventDate': new Date(item.Date),
                            'eventTitle': item.Title,
                            'eventDescription': item.description,
                            'eventId': item.DateID,
                            'eventSpecDate': item.eventSpecificDate,
                            'eventtimeZone': item.TimeZone,
                            'learnMoreURL': item.learnMoreURL
                        });
                    }
                    eventData.events = events;
                    return events;
                }
            }
        }
        getCurrentMonthEvents(currentMonthYear);
        if (events) {
            var inputDate = $('#calendar');

            function changeYearButtons() {
                setTimeout(function() {
                    var appendGrid = $('.ui-datepicker-header').find('.ui-datepicker-title');
                    var prevYrBtn = $('<a href="#" class="uparrow"></a>');
                    prevYrBtn.bind('click', function() {
                        event.preventDefault();
                        $.datepicker._adjustDate(inputDate, -1, 'Y');
                    });
                    prevYrBtn.appendTo(appendGrid);
                    var nextYrBtn = $('<a href="#" class="downarrow"></a>');
                    nextYrBtn.bind('click', function() {
                        event.preventDefault();
                        $.datepicker._adjustDate(inputDate, +1, 'Y');
                    });
                    nextYrBtn.appendTo(appendGrid);
                }, 1);
            }
            $('#calendar').datepicker({
                //highlighting the event dates
                beforeShowDay: changeYearButtons(),
                beforeShowDay: function(date) {
                    var result = [true, '', null];
                    var matching = $.grep(events, function(event) {
                        return event.eventDate.valueOf() === date.valueOf();
                    });
                    if (matching.length) {
                        result = [true, 'highlight', null];
                    }
                    return result;
                },
                onSelect: function(dateText) {
                    changeYearButtons();
                    //on date selection generating modal box
                    var date,
                        selectedDate = new Date(dateText),
                        event = null;
                    filterObj = events.filter(function(e) {
                        return e.eventId == selectedDate.getDate();
                    });
                    if (filterObj.length > 0) {
                        generateModalBox(filterObj, itemNo);
                        $('.events-prev-next .events-prev').addClass('disabled');
                    }
                    if (filterObj.length === 1) {
                        $('.events-prev-next .events-prev').addClass('disabled');
                        $('.events-prev-next .events-next').addClass('disabled');
                    }
                },
                //Calander onchange month functioality
                onChangeMonthYear: function(year, month) {
                    changeYearButtons();
                    currentMonthYear = year + '-' + month;
                    getCurrentMonthEvents(currentMonthYear);
                }
            });
            //Generating Event modal box
            function generateModalBox(filterObj, itemNo) {
                var eventsModal = document.getElementById('eventsModal');
                var modalBox = '';
                modalBox += '<div class="event-date-header"><span>' + filterObj[itemNo].eventSpecDate + ' Events</span> <a href="#" class="close-btn">X</a></div>' +
                    '<div class="event-time">' + filterObj[itemNo].eventtimeZone + '</div>' +
                    '<div class="event-title">' + filterObj[itemNo].eventTitle + '</div>' +
                    '<div class="event-description">' + filterObj[itemNo].eventDescription + '</div><a href="' + filterObj[itemNo].learnMoreURL + '" class="event-btn" target="_blank">Learn more</a>' +
                    '<div class="events-prev-next"><span class="events-prev glyphicon glyphicon-triangle-top"></span><span class="events-next glyphicon glyphicon-triangle-bottom"></span></div>';
                $(eventsModal).html(modalBox);
                eventsModal.style.display = 'block';
            }
            //Event box Next Item
            $(document).on('click', '.events-next', function() {
                if (itemNo < (filterObj.length - 1)) {
                    itemNo = itemNo + 1;
                    generateModalBox(filterObj, itemNo);
                    if (itemNo === (filterObj.length - 1)) {
                        $('.events-prev-next .events-next').addClass('disabled');
                    }
                }
            });
            //Event box Prev Item
            $(document).on('click', '.events-prev', function() {
                if (itemNo > 0) {
                    itemNo = itemNo - 1;
                    generateModalBox(filterObj, itemNo);
                    if (itemNo == 0) {
                        $('.events-prev-next .events-prev').addClass('disabled');
                    }
                }
            });
            // Event Close btn
            $(document).on('click', '.close-btn', function() {
                itemNo = 0;
                $('#eventsModal').hide();
                event.preventDefault();
            });
        }
    }
});
