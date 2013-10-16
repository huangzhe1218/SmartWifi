$(document).on('click', '#app9', function () {
		var mac = $('#check1').val();
		$.post('check',{'mac':mac});
});