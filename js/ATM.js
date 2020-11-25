var i = 2; //定义密码输错的次数

//判断输入的卡号是不是数字类型
//返回true，证明不是数字；返回false，证明是数字
var users = {
    '123': {'pwd': '123', 'balance': '2000', 'records': []},
    '456': {'pwd': '123', 'balance': '5000', 'records': []},
}

var current_user = "";


function checkNumber(account) {
    var pattern = /^[0-9]*[1-9][0-9]*$/;
    account += ".00";
    return pattern.test(account);
}

function checkAccount(account) {
    var pattern = /^[0-9]*[1-9][0-9]*$/;
    return pattern.test(account);
}

//判断输入的卡号和密码是否为空
function checkNull(account, password) {
    return account.length > 0 && password.length > 0;

}

var alert_app = new Vue({
    el: '#alert_app',
    data: {
        isHidden: '',
        alert_info: ''
    },
    methods: {
        close: function () {
            this.isHidden = '';
        }
    },
    watch: {
        isHidden: function () {
            //定时消失事件
            if (this.isHidden !== '') {
                let myVar = setInterval(function () {
                    alert_app.isHidden = '';
                    clearInterval(myVar);
                }, 1200);
            }
        }
    },
});


Vue.component('record_item', {
    template: '\
    <tr>\
     <td>{{record.id}}</td>\
     <td>{{record.opt}}</td>\
     <td>{{record.amount}}</td>\
     <td>{{record.balance}}</td>\
     <td>{{record.time}}</td>\
    </tr>\
  ',
    props: ['record']
});

var record_app = new Vue({
    el: '#record_app',
    data: {
        records: [],
    },
    methods: {}
});

//登录事件
function login() {
    var account = document.getElementById("account").value;
    var password = document.getElementById("password").value;

    if (!checkNull(account, password)) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '卡号和密码不能为空!';
        return; //终止登录方法，下面的代码不会执行
    }
    if (!checkAccount(account)) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '卡号必须为数字!';
        return;
    }
    let x_pwd
    try {
        x_pwd = users[account].pwd;
    } catch (err) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '卡号不存在!';
        return;
    }
    if (i > 0 && password == x_pwd) {
        current_user = account;
        document.getElementById("nav_login").hidden = true;
        document.getElementById("nav_home").hidden = false;
        document.getElementById("input_balance").value = users[account].balance; //修改存款完成以后显示的余额
        document.getElementById("input_deposit").value = 0;
        document.getElementById("input_withdraw").value = 0;
        record_app.records = users[account].records;


    } else {
        // if (i == 0) {
        //     alert("当前卡号被锁定！");
        //     return;
        // }
        // alert("你还剩下" + i + "次输入卡号和密码的机会");
        // i--;
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '密码错误!';
        document.getElementById("password").value = "";
        return;
    }
}

//格式化日期
function dateFormat(thisDate, fmt) {
    var o = {
        "M+": thisDate.getMonth() + 1,
        "d+": thisDate.getDate(),
        "h+": thisDate.getHours(),
        "m+": thisDate.getMinutes(),
        "s+": thisDate.getSeconds(),
        "q+": Math.floor((thisDate.getMonth() + 3) / 3),
        "S": thisDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (thisDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}


// var isOperating = false;
//存款
var deposit = function () {
    // if (isOperating === true) {
    //     alert_app.isHidden = 'truthy';
    //     alert_app.alert_info = '请稍后再试!';
    //     return;
    // }
    // isOperating = true;
    // sleep(3000);
    let input_balance_val = parseFloat(users[current_user].balance);//获取余额，并将其转换为数字
    let input_deposit_val = document.getElementById("input_deposit").value;

    if (!input_deposit_val.length > 0) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '请输入您要存款的金额!';
        return;
    }
    if (checkNumber(input_deposit_val)) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '请输入数字!';
        return;
    }
    if (input_deposit_val % 100 != 0) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '请输入100的整数倍!';
        return;
    }
    if (input_deposit_val < 100) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '金额太小!';
        return;
    }

    input_balance_val += parseFloat(input_deposit_val);
    document.getElementById("input_balance").value = input_balance_val; //修改存款完成以后显示的余额

    users[current_user].balance = input_balance_val;
    users[current_user].records.push({
        id: users[current_user].records.length,
        opt: '存入',
        amount: input_deposit_val,
        balance: input_balance_val,
        time: dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
    });

    // isOperating = false;
};

//取款
var withdraw = function () {
    // if (isOperating === true) {
    //     alert_app.isHidden = 'truthy';
    //     alert_app.alert_info = '请稍后再试!';
    //     return;
    // }
    // isOperating = true;
    let input_balance_val = parseFloat(users[current_user].balance); //获取余额，并将其转换为数字
    let input_withdraw_val = document.getElementById("input_withdraw").value;

    if (!input_withdraw_val.length > 0) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '请输入您要取款的金额!';
        return;
    }
    if (checkNumber(input_withdraw_val)) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '请输入数字!';
        return;
    }
    if (input_withdraw_val % 100 != 0) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '请输入100的整数倍!';
        return;
    }
    if (input_withdraw_val < 100) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '金额太小!';
        return;
    }
    //判断取款是否大于余额
    if (parseFloat(input_withdraw_val) > input_balance_val) {
        alert_app.isHidden = 'truthy';
        alert_app.alert_info = '余额不足!';
        return;
    }

    input_balance_val -= parseFloat(input_withdraw_val);
    document.getElementById("input_balance").value = input_balance_val;

    users[current_user].balance = input_balance_val;
    users[current_user].records.push({
        id: users[current_user].records.length,
        opt: '支出',
        amount: input_withdraw_val,
        balance: input_balance_val,
        time: dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
    });
    // isOperating = false;
};

var exit = function () {
    // document.getElementById("account").value = "";
    document.getElementById("password").value = "";
    document.getElementById("nav_login").hidden = false;
    document.getElementById("nav_home").hidden = true;
    current_user = "";
}



