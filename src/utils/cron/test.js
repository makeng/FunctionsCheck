/*----------------------------------------------------------------------------------
* about:测试文件
* author:马兆铿
* date:2018-8-20
* ----------------------------------------------------------------------------------*/

import { cron } from "./cron";
import dayjs from "dayjs";

/**
 * 测试
 */
export function test() {
  //预设变量
  let str = "";
  let cronStr = "";
  const setTime = "12:30";
  const current = dayjs();
  const currentTime = current.format("HH:mm");
  const nextMinuteTime = current.add(1, 'minute').format("HH:mm");
  const lastMinuteTime = current.subtract(1, 'minute').format("HH:mm");

  console.log(lastMinuteTime);
  console.log(currentTime);
  console.log(nextMinuteTime);


  //5种情况
  //1.每天
  str = cron(setTime, [1, 2, 3, 4, 5, 6, 7]);
  cronStr = "0 30 12 * * ? *";
  console.info(1, str, cronStr, str === cronStr);

  //2.选择了某个星期
  str = cron(setTime, [1]);
  cronStr = "0 30 12 ? * 1 *";
  console.info(2, str, cronStr, str === cronStr);

  str = cron(setTime, [1, 5, 6]);
  cronStr = "0 30 12 ? * 1,5,6 *";
  console.info(2, str, cronStr, str === cronStr);

  //3.上一分钟：明天
  str = cron(lastMinuteTime, []);
  cronStr = `0 ` +
    `${parseInt(lastMinuteTime.split(":")[1])} ` +
    `${parseInt(lastMinuteTime.split(":")[0])} ` +
    `${current.add(1, "day").date()} ` +
    `${current.add(1, "day").month() + 1} ` +
    `? ${current.add(1, "day").year()}`;
  console.info(3, str, cronStr, str === cronStr);

  //4.当前：明天
  str = cron(currentTime, []);
  cronStr = `0 ` +
    `${parseInt(currentTime.split(":")[1])} ` +
    `${parseInt(currentTime.split(":")[0])} ` +
    `${current.add(1, "day").date()} ` +
    `${current.add(1, "day").month() + 1} ` +
    `? ${current.add(1, "day").year()}`;
  console.info(4, str, cronStr, str === cronStr);

  //5.下一分钟：今天
  str = cron(nextMinuteTime, []);
  cronStr = `0 ` +
    `${parseInt(nextMinuteTime.split(":")[1])} ` +
    `${parseInt(nextMinuteTime.split(":")[0])} ` +
    `${current.date()} ` +
    `${current.month() + 1} ` +
    `? ${current.year()}`;
  console.info(5, str, cronStr, str === cronStr);
}