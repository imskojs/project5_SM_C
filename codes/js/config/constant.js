/**
 * Created by Andy on 6/6/2015
 * As part of myfitmate
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 6/6/2015
 *
 */

/**
 * Created by Andy on 5/26/2015
 * As part of beijingtongclient
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 5/26/2015
 *
 */


/*
 *
 * Constant app config
 *
 */


(function() {
  'use strict';

  angular.module('app')
    .constant("governorUrl", "http://52.68.158.234")
  // .constant("governorUrl", "http://192.168.0.65:1337")
  // .constant("governorUrl", "http://192.168.0.13:1337")
  .constant("appName", "schoolMarket")
    .constant("appId", 3)
    .constant("googlePushSenderID", "80216654611")
    .constant("kakaoKey", "bdb254de02ea0b7521635ba469608674")
    .constant("facebookKey", "442354165953949");

})();
