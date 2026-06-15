$(function () {
    Retrieve();
});

function Retrieve() {
    var dataArray = [];
    // 📋 請確認此處的網址為您 Apps Script 的網頁應用程式 URL
    var URL = 'https://script.google.com/macros/s/AKfycbw5b-uc82EdY2aM7sDHx9DvQzk3xxSPTQ6JxTcw-MsSLI__qTxSUAM0ZJ22vqHo3GJLOg/exec';
	
    $.ajax({
        url: URL,
        type: 'GET', // ✨ 修正：改為 GET 請求配合 Apps Script 的 doGet，連線最穩定且不觸發 CORS 阻擋
        dataType: "json",
        error: function (xhr) {
            alert('發生錯誤！無法與佈告欄資料庫連線，請重新再試一次～');
        },
        success: function (Jdata) {
            var Info = Jdata.data;
			var Length = Number(Info.length);
            
            // ✨ 修正：載入新資料前，先清空原本 tbody 內的所有舊內容
            $("#table-data").html(''); 

			if(Length > 0) {
				for (var i = 0; Info.length > i; i++) {
                    // ✨ 修正：加上 var 宣告為區域變數，避免全域變數相互污染
					var FillTime = Info[i].FillTime;
					var Appclass = Info[i].Appclass;
					var APP_name = Info[i].APP_name;
					var ItemClass = Info[i].ItemClass;
					var BorrowDate = Info[i].BorrowDate;
					var EndTime = Info[i].EndTime;
					var Reason = Info[i].Reason;
                    
					// 印出資料 (將變數帶入函式中傳遞)
					print(FillTime, Appclass, APP_name, ItemClass, BorrowDate, EndTime, Reason);
				}
			} else {
			    $("#table-data").append('<tr id="no-data-row"><td colspan="7" style="text-align:center; padding: 20px; color: gray;">目前暫無待處理的公告事項</td></tr>');
		    }

            // 資料列印 (修正：明確接收參數)
            function print(FillTime, Appclass, APP_name, ItemClass, BorrowDate, EndTime, Reason) {
                $("#table-data").append(
                    '<tr>' +
                    '<td class="w-15">' + FillTime + '</td>' +
                    '<td class="w-10">' + Appclass + '</td>' +
                    '<td class="w-10">' + APP_name + '</td>' +
                    '<td class="w-10">' + ItemClass + '</td>' +
                    '<td class="w-15">' + BorrowDate + '</td>' +
                    '<td class="w-15">' + EndTime + '</td>' +
                    '<td class="w-15">' + Reason + '</td>' +
                    '</tr>'
                );
            }

            // 公告事項搜尋 (修正：使用 off("click") 防止重複綁定點擊事件)            
            $("#doaction").off("click").click(function () {
                select();
            });

            function select() {
                var selectedValue = $("#select").val();
                search_table(selectedValue);
            }

            function search_table(value) {
               	// 1. 先移除舊的「暫無資料」提示列
   		        $("#no-data-row").remove();

    		    var visibleCount = 0; // 用來計算目前顯示的列數

                // ✨ 修正：明確指定只搜尋 #table-data 裡的 tr，不影響 standard thead 結構
   		        $('#table-data tr').each(function () {
                    
                    // 🔥 關鍵修正：如果選擇的是「全部」或空值，直接強制顯示，不進行文字比對
                    if (value === "全部" || value === "" || value === null) {
                        $(this).show();
                        visibleCount++;
                    } else {
                        var found = false;
                        
                        // ✨ 修正：使用 .find('td') 精確巡覽這一列中的每一個儲存格
                        $(this).find('td').each(function () {
                            if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                                found = true;
                            }
                        });

                        if (found === true) {
                            $(this).show();
                            visibleCount++; 
                        } else {
                            $(this).hide();
                        }
                    }
    	    	});

   		        // 2. 如果計數為 0，表示沒有符合搜尋條件的資料
    		    if (visibleCount === 0) {
        	        $('#table-data').append(
            		    '<tr id="no-data-row">' +
           		        '<td colspan="7" style="text-align:center; padding: 20px; color: gray;">找不到符合「' + value + '」的公告事項</td>' +
           		        '</tr>'
        	        );
    		    }

	        }
	    }
    });
}