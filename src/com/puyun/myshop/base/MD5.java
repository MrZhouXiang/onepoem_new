package com.puyun.myshop.base;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 加密算法
 */
public class MD5 {
    /**
     * @param oldString
     * @return
     * @throws Exception
     */
    public static  String md5Encode(String oldString){
        if(oldString.isEmpty()){
            return oldString;
        }
        char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
        byte[] strTemp = oldString.getBytes();
        MessageDigest messageDigest = null;
        try {
            messageDigest = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        messageDigest.update(strTemp);
        byte[] mdByte = messageDigest.digest();
        int j = mdByte.length;
        char str[] = new char[j * 2];
        int k = 0;
        for (int i = 0; i < j; i++) {
            byte byte0 = mdByte[i];
            str[k++] = hexDigits[byte0 >>> 4 & 0xf];
            str[k++] = hexDigits[byte0 & 0xf];
        }
        return new String(str);
    }
}
