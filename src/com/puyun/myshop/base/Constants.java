package com.puyun.myshop.base;

/**
 * 本系统的常量类，在这里定义所有系统用到的常量。
 * 
 * @author hu.rongliang
 * 
 */
public class Constants
{

    static
    {

        // 定义推送任务队列,一个线程，最大任务为60,任务执行后等待时间
        PUSH_WORKQUEUE = new WorkQueue(3, 60, 1000);

    }

    public static final WorkQueue PUSH_WORKQUEUE;

    public static final String APP_SESSION = "appUser";

    // 后台管理系统
    public static final String USER_INFO_SESSION = "userSessionInfo";

    /**
     * 超级管理员的用户名KEY
     */
    public static final String SYSTEM_USER = "SYSTEM_USER";

    /**
     * 超级管理员的密码KEY
     */
    public static final String SYSTEM_PWD = "SYSTEM_PASSWORD";

    /**
     * 资源存放路径
     */
    public static final String RES_PATH = "/../res";

    /**
     * 头像图片路径
     */
    public static final String DEFAULT_AVATAR_PATH = RES_PATH
            + "/assets/avatar/";

    /**
     * 资讯图片路径
     */
    public static final String DEFAULT_INFO_PATH = RES_PATH
            + "/assets/img/info/";

    /**
     * 公告图片路径
     */
    public static final String DEFAULT_NOTI_PATH = RES_PATH
            + "/assets/img/noti/";

    /**
     * 活动图片路径
     */
    public static final String DEFAULT_PARTY_PATH = RES_PATH
            + "/assets/img/party/";

    /**
     * 供求图片路径
     */
    public static final String DEFAULT_SUPPLY_PATH = RES_PATH
            + "/assets/img/supply/";

    /**
     * 公司logo路径
     */
    public static final String DEFAULT_LOGO_PATH = RES_PATH
            + "/assets/img/logo/";

    /**
     * 产品路径
     */
    public static final String DEFAULT_PRODUCTION_PATH = RES_PATH
            + "/assets/img/production/";

    /**
     * 产品路径
     */
    public static final String DEFAULT_ORGANIZATION_PATH = RES_PATH
            + "/assets/img/organization/";

    /**
     * 资讯分类图片地址
     */
    public static final String DEFAULT_CATE_PATH = RES_PATH
            + "/assets/img/category/";

    /**
     * 照片地址
     */
    public static final String DEFAULT_PHOTO_PATH = RES_PATH
            + "/assets/img/photo/";

    /**
     * 下载二维码地址
     */
    public static final String TWO_DIMENSION_CODE_PATH = RES_PATH
            + "/assets/img/chamber_140.png";

    /**
     * 下载二维码的存放目录
     */
    public static final String TWO_DIMENSION_CODE_DIR = RES_PATH
            + "/assets/img";

    /**
     * App通用下载地址（Android、IOS、后台页面），
     */
    public static final String DOWNLOAD_LINK_PATH = "/downloadApp";

    /**
     * 广告位图片路径
     */
    public static final String DEFAULT_AD_PATH = RES_PATH + "/assets/img/ad/";

    /**
     * 诗图片路径
     */
    public static final String DEFAULT_MODEL_PATH = RES_PATH
            + "/assets/img/model/";

    /**
     * 诗人头像路径
     */
    public static final String DEFAULT_AUTHOR_PATH = RES_PATH
            + "/assets/img/author/";

    /**
     * 商品图片路径
     */
    public static final String DEFAULT_GOODS_PATH = RES_PATH
            + "/assets/img/goods/";

    /**
     * 聊天图片路径
     */
    public static final String DEFAULT_CHAT_PATH = RES_PATH
            + "/assets/img/chat/";

    /**
     * APK包路径
     */
    public static final String DEFAULT_APK_PATH = RES_PATH + "/assets/apk/";

    /**
     * 支付宝支付信息
     */
    public static class PayInfo
    {
        // 商户PID
        public static final String PARTNER = "2088021296479457";
        // 商户收款账号
        public static final String SELLER = "yilenb@163.com";
        // 商户私钥，pkcs8格式
        public static final String RSA_PRIVATE = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJs6pnu+p1N96U0GCmVj4c5146vedv8CPoPId1VlIkmNdzIV7rnZVZOhbq5UQOYPwxsQTp84YrZlYlg03WMh10L5YDuACU3AKNGWAI/1C4LekYO8IT+bYsjpSUh/J19g09zPEONL31gSdjeLayQSr3aboBS5TLovK65TpdumcIQDAgMBAAECgYEAjGZD5nDOzwl3Vp88D/CDcEXYor8YShYxjOhoZuiOVpCJWtfTkG0updTBUxQJjwx6n6PkOMa7IdYZWUaXZu5Yz2YaK3za62FNgRG7aVw7ob9XkpLKusw4AR7NOtGsnF7S7wu+6Y8wD4pKcvYHaWuLTWVXz2Bd011KwXHyREIMXCECQQDMvo9BLvZK9dpUIl8oSiljYbonDJ/GpzU1TZLVUmUdVX76eg7kHS+4zUQWgaDpfRp++FkeBcbYUOlgGiyu2nBlAkEAwhbO/XBbleoSZlnVI7sw6AgQS+XEcQahrwy39zoY6YKxyw/nx2dddgjOI+701fHeI5PLU35sD8aLrmlvRbx4RwJAG70pjWw+ZBOA++sYN04s41EHNmkocHKQ6+LRpOMf3eSKaocE43Ts1T3CHsZ7NYcEgvVEpaOkuAPmSmXhbeMcXQJAMbA5KbT8HXMhZsaUxGMF8EEwOt4F3pG+DtyItGhRPGbTMZNO2UPjL3atn5FraOJU5nLN2QBClf9Uf0BK1mWbvQJARj4I+8O9TPA56t7QkgZQwwsiF7AW9pza2ZpxI16TBFPgn3SjnJeI+OzfyAQUX4M0hvXqcehoWfb3rvuyiNkg4w==";
        // 商户的私钥, 对应rsa_public_key.pem的值
        public static final String RSA_PUBLIC = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbOqZ7vqdTfelNBgplY+HOdeOr3nb/Aj6DyHdVZSJJjXcyFe652VWToW6uVEDmD8MbEE6fOGK2ZWJYNN1jIddC+WA7gAlNwCjRlgCP9QuC3pGDvCE/m2LI6UlIfydfYNPczxDjS99YEnY3i2skEq92m6AUuUy6LyuuU6XbpnCEAwIDAQAB";
    }

    /**
     * 
     * TODO APP相关系统配置. Created on 2015年10月1日 上午10:01:38
     * 
     * @author 周震
     */
    public static class AppSysConstans
    {

        /**
         * 抢单时候 一个抢单商户最多可有的待发货的订单个数
         */
        public static final int UNSEND_ORDER_NUM = 30;

        /**
         * 抢单时候 一件商品最多可被抢单的个数
         */
        public static final int HAS_QIANGDAN_NUM = 20;

        /**
         * 参数系数，用于计算商品基础价格
         */
        public static final int A = 1;

        /**
         * 推送版本
         */
        public static final int PushV = 7;

    }

}
