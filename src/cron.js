/*----------------------------------------------------------------------------------
* about:cron字符串生成
* author:马兆铿
* date:2018-8-9
* ----------------------------------------------------------------------------------*/

import dayjs from "dayjs";

/**
 * 输出cron字符串
 * @param time 时分字符串
 * @param dayOfWeekArr 星期数组
 */
export function cron(time, dayOfWeekArr) {
  const sec = 0;
  let dayOfMonth = "*";
  let month = "*";

  //时间处理
  let min = null;
  let hour = null;
  if (typeof time === "string" && /^([01][0-9]|2[0-3])\:[0-5][0-9]$/.test(time)) {
    const timeArr = time.split(":");
    hour = parseInt(timeArr[0]);
    min = parseInt(timeArr[1]);
  } else {
    throw Error({
      message: "时间格式不对",
    });
  }

  //星期处理
  let dayOfWeek = "";
  if (Array.isArray(dayOfWeekArr)) {
    // 全部天数
    if (dayOfWeekArr.length === 7) {
      dayOfWeek = "?";
    }
    // 有内容
    else if (dayOfWeekArr.length) {
      dayOfWeekArr.forEach((item, index) => {
        dayOfWeek += ( item + ",");
      });
      dayOfWeek = dayOfWeek.slice(0, dayOfWeek.length - 1); // 最后一个逗号
      dayOfMonth = "?";
    }
    //空，表示只执行一次，要判断当前时间，是不是早于设定时间
    else {
      dayOfWeek = "?";
      const current = dayjs();
      month = current.month() + 1;
      const currentTimeStamp = current.valueOf(); // 当前时间戳
      const chooseTimeAndDate = `${current.format("YYYY-MM-DD")} ${time}`; // 后面时间戳
      // 如果选择的时间早于当前，则今天生效
      if (currentTimeStamp < dayjs(chooseTimeAndDate).valueOf()) {
        dayOfMonth = current.date();
      }
      // 否则明天生效
      else {
        dayOfMonth = current.add(1, 'days').date();
      }
    }
  } else {
    throw Error({
      message: "星期必须是数组",
    });
  }

  return `${sec} ${min} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

/**
 * 校验cron字符串的合法性，但是正确性不保证
 * @param cronExpression The expression to validate
 * @return True is expression is valid
 */
export function cronValidate(cronExpression) {
  //alert("校验函数的开始！");
  var cronParams = cronExpression.split(" ");
  if (cronParams.length < 6 || cronParams.length > 7) {
    return false;
  }
  //CronTrigger cronTrigger = new CronTrigger();
  //cronTrigger.setCronExpression( cronExpression );
  if (cronParams[3] == "?" || cronParams[5] == "?") {
    //Check seconds param
    if (!checkSecondsField(cronParams[0])) {
      return false;
    }
    //Check minutes param
    if (!checkMinutesField(cronParams[1])) {
      return false;
    }
    //Check hours param
    if (!checkHoursField(cronParams[2])) {
      return false;
    }
    //Check day-of-month param
    if (!checkDayOfMonthField(cronParams[3])) {
      return false;
    }
    //Check months param
    if (!checkMonthsField(cronParams[4])) {
      return false;
    }
    //Check day-of-week param
    if (!checkDayOfWeekField(cronParams[5])) {
      return false;
    }
    //Check year param
    if (cronParams.length == 7) {
      if (!checkYearField(cronParams[6])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

function checkSecondsField(secondsField) {
  return checkField(secondsField, 0, 59);
}

function checkField(secondsField, minimal, maximal) {
  if (secondsField.indexOf("-") > -1) {
    var startValue = secondsField.substring(0, secondsField.indexOf("-"));
    var endValue = secondsField.substring(secondsField.indexOf("-") + 1);

    if (!(checkIntValue(startValue, minimal, maximal, true) && checkIntValue(endValue, minimal, maximal, true))) {
      return false;
    }
    try {
      var startVal = parseInt(startValue, 10);
      var endVal = parseInt(endValue, 10);

      return endVal > startVal;
    } catch (e) {
      return false;
    }
  } else if (secondsField.indexOf(",") > -1) {
    return checkListField(secondsField, minimal, maximal);
  } else if (secondsField.indexOf("/") > -1) {
    return checkIncrementField(secondsField, minimal, maximal);
  } else if (secondsField.indexOf("*") != -1) {
    return true;
  } else {
    return checkIntValue(secondsField, minimal, maximal);
  }
}

function checkIntValue(value, minimal, maximal, checkExtremity) {
  try {
    var val = parseInt(value, 10);
    //判断是否为整数
    if (value == val) {
      if (checkExtremity) {
        if (val < minimal || val > maximal) {
          return false;
        }
      }

      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

function checkMinutesField(minutesField) {
  return checkField(minutesField, 0, 59);
}

function checkHoursField(hoursField) {
  return checkField(hoursField, 0, 23);
}

function checkDayOfMonthField(dayOfMonthField) {
  if (dayOfMonthField == "?") {
    return true;
  }

  if (dayOfMonthField.indexOf("L") >= 0) {
    return checkFieldWithLetter(dayOfMonthField, "L", 1, 7, -1, -1);
  } else if (dayOfMonthField.indexOf("W") >= 0) {
    return checkFieldWithLetter(dayOfMonthField, "W", 1, 31, -1, -1);
  } else if (dayOfMonthField.indexOf("C") >= 0) {
    return checkFieldWithLetter(dayOfMonthField, "C", 1, 31, -1, -1);
  } else {
    return checkField(dayOfMonthField, 1, 31);
  }
}


function checkMonthsField(monthsField) {
  /*        monthsField = StringUtils.replace( monthsField, "JAN", "1" );
          monthsField = StringUtils.replace( monthsField, "FEB", "2" );
          monthsField = StringUtils.replace( monthsField, "MAR", "3" );
          monthsField = StringUtils.replace( monthsField, "APR", "4" );
          monthsField = StringUtils.replace( monthsField, "MAY", "5" );
          monthsField = StringUtils.replace( monthsField, "JUN", "6" );
          monthsField = StringUtils.replace( monthsField, "JUL", "7" );
          monthsField = StringUtils.replace( monthsField, "AUG", "8" );
          monthsField = StringUtils.replace( monthsField, "SEP", "9" );
          monthsField = StringUtils.replace( monthsField, "OCT", "10" );
          monthsField = StringUtils.replace( monthsField, "NOV", "11" );
          monthsField = StringUtils.replace( monthsField, "DEC", "12" );*/

  monthsField.replace("JAN", "1");
  monthsField.replace("FEB", "2");
  monthsField.replace("MAR", "3");
  monthsField.replace("APR", "4");
  monthsField.replace("MAY", "5");
  monthsField.replace("JUN", "6");
  monthsField.replace("JUL", "7");
  monthsField.replace("AUG", "8");
  monthsField.replace("SEP", "9");
  monthsField.replace("OCT", "10");
  monthsField.replace("NOV", "11");
  monthsField.replace("DEC", "12");

  return checkField(monthsField, 1, 31);
}

function checkDayOfWeekField(dayOfWeekField) {
  /*        dayOfWeekField = StringUtils.replace( dayOfWeekField, "SUN", "1" );
          dayOfWeekField = StringUtils.replace( dayOfWeekField, "MON", "2" );
          dayOfWeekField = StringUtils.replace( dayOfWeekField, "TUE", "3" );
          dayOfWeekField = StringUtils.replace( dayOfWeekField, "WED", "4" );
          dayOfWeekField = StringUtils.replace( dayOfWeekField, "THU", "5" );
          dayOfWeekField = StringUtils.replace( dayOfWeekField, "FRI", "6" );
          dayOfWeekField = StringUtils.replace( dayOfWeekField, "SAT", "7" );*/

  dayOfWeekField.replace("SUN", "1");
  dayOfWeekField.replace("MON", "2");
  dayOfWeekField.replace("TUE", "3");
  dayOfWeekField.replace("WED", "4");
  dayOfWeekField.replace("THU", "5");
  dayOfWeekField.replace("FRI", "6");
  dayOfWeekField.replace("SAT", "7");

  if (dayOfWeekField == "?") {
    return true;
  }
  if (dayOfWeekField.indexOf("L") >= 0) {
    return checkFieldWithLetter(dayOfWeekField, "L", 1, 7, -1, -1);
  } else if (dayOfWeekField.indexOf("C") >= 0) {
    return checkFieldWithLetter(dayOfWeekField, "C", 1, 7, -1, -1);
  } else if (dayOfWeekField.indexOf("#") >= 0) {
    return checkFieldWithLetter(dayOfWeekField, "#", 1, 7, 1, 5);
  } else {
    return checkField(dayOfWeekField, 1, 7);
  }
}

function checkYearField(yearField) {
  return checkField(yearField, 1970, 2099);
}

function checkFieldWithLetter(value, letter, minimalBefore, maximalBefore,
                              minimalAfter, maximalAfter) {
  var canBeAlone = false;
  var canHaveIntBefore = false;
  var canHaveIntAfter = false;
  var mustHaveIntBefore = false;
  var mustHaveIntAfter = false;
  if (letter == "L") {
    canBeAlone = true;
    canHaveIntBefore = true;
    canHaveIntAfter = false;
    mustHaveIntBefore = false;
    mustHaveIntAfter = false;
  }
  if (letter == "W" || letter == "C") {
    canBeAlone = false;
    canHaveIntBefore = true;
    canHaveIntAfter = false;
    mustHaveIntBefore = true;
    mustHaveIntAfter = false;
  }
  if (letter == "#") {
    canBeAlone = false;
    canHaveIntBefore = true;
    canHaveIntAfter = true;
    mustHaveIntBefore = true;
    mustHaveIntAfter = true;
  }
  var beforeLetter = "";
  var afterLetter = "";
  if (value.indexOf(letter) >= 0) {
    beforeLetter = value.substring(0, value.indexOf(letter));
  }
  if (!value.endsWith(letter)) {
    afterLetter = value.substring(value.indexOf(letter) + 1);
  }
  if (value.indexOf(letter) >= 0) {
    if (letter == value) {
      return canBeAlone;
    }
    if (canHaveIntBefore) {
      if (mustHaveIntBefore && beforeLetter.length == 0) {
        return false;
      }

      if (!checkIntValue(beforeLetter, minimalBefore, maximalBefore, true)) {
        return false;
      }
    } else {
      if (beforeLetter.length > 0) {
        return false;
      }
    }
    if (canHaveIntAfter) {
      if (mustHaveIntAfter && afterLetter.length == 0) {
        return false;
      }

      if (!checkIntValue(afterLetter, minimalAfter, maximalAfter, true)) {
        return false;
      }
    } else {
      if (afterLetter.length > 0) {
        return false;
      }
    }
  }
  return true;
}

function checkIncrementField(value, minimal, maximal) {
  var start = value.substring(0, value.indexOf("/"));
  var increment = value.substring(value.indexOf("/") + 1);
  if (!("*" == start)) {
    return checkIntValue(start, minimal, maximal, true) && checkIntValue(increment, minimal, maximal, false);
  } else {
    return checkIntValue(increment, minimal, maximal, true);
  }
}

function checkListField(value, minimal, maximal) {
  var st = value.split(",");
  var values = new Array(st.length);
  for (var j = 0; j < st.length; j++) {
    values[j] = st[j];
  }
  var previousValue = -1;
  for (var i = 0; i < values.length; i++) {
    var currentValue = values[i];

    if (!checkIntValue(currentValue, minimal, maximal, true)) {
      return false;
    }
    try {
      var val = parseInt(currentValue, 10);

      if (val <= previousValue) {
        return false;
      } else {
        previousValue = val;
      }
    } catch (e) {
      // we have always an int
    }
  }
  return true;
}
