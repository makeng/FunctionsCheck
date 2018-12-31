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
  let year = "*";

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
      //
      const currentTimeStamp = current.valueOf(); // 当前时间戳
      const chooseTimeAndDate = `${current.format("YYYY-MM-DD")} ${time}`; // 选择的时间字符串
      // 如果选择的时间早于当前，则今天生效
      if (currentTimeStamp <= dayjs(chooseTimeAndDate).valueOf()) {
        dayOfMonth = current.date();
        month = current.month() + 1; //月份是要加1的
        year = current.year();
      }
      // 否则明天生效
      else {
        const nextDay = current.add(1, 'days');
        dayOfMonth = nextDay.date();
        month = nextDay.month() + 1; //月份是要加1的
        year = nextDay.year();
      }
    }
  } else {
    throw Error({
      message: "星期必须是数组",
    });
  }

  return `${sec} ${min} ${hour} ${dayOfMonth} ${month} ${dayOfWeek} ${year}`;
}
