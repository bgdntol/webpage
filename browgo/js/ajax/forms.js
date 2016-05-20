
function send_feedback(number) {


    if ($('#feedback_name' + number).val()) var name = $('#feedback_name' + number).val()
    else var name = ''
    if ($('#feedback_phone' + number).val()) var phone = $('#feedback_phone' + number).val()
    else var phone = ''
    if ($('#feedback_email' + number).val()) var email = $('#feedback_email' + number).val()
    else var email = ''
    if ($('#feedback_comment' + number).val()) var comment = $('#feedback_comment' + number).val()
    else var comment = ''
    if ($('#token' + number).val()) var token = $('#token' + number).val()
    else var token = ''



    $.ajax({
        method: "GET",
        url: "/feedback",
        dataType: 'JSON',
        data: {
            name: name,
            phone: phone,
            email: email,
            comment: comment,
            '_token': token
        }
    })
        .done(function (msg) {
            if (msg.status === 'ok') {
                //console.log('sent')
                $('#form-' + number).html('<p style="text-align: center">Ваша заявка принята.</p>')
            }
            else console.log('error')
        });

}

