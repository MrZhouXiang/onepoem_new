package com.puyun.myshop.ctrl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.puyun.myshop.base.Constants;
import com.puyun.myshop.base.util.FileUtils;
import com.puyun.myshop.base.util.ImageUtils;
import com.puyun.myshop.entity.FileMeta;

/**
 * Created by AI-MASK on 14-6-16.
 */
@Controller
@RequestMapping("/controller")
public class FileCtrl
{
    private static final Logger logger = Logger.getLogger(FileCtrl.class);

    LinkedList<FileMeta> files = null;// new LinkedList<FileMeta>();
    FileMeta fileMeta = null;

    /***************************************************
     * URL: /controller/upload upload(): receives files
     * 
     * @param request
     *            : MultipartHttpServletRequest auto passed
     * @param type
     *            : int auto passed
     * @return LinkedList<FileMeta> as json format
     ****************************************************/
    @RequestMapping(value = "/upload/{type}", method = RequestMethod.POST)
    public @ResponseBody
    FileMeta upload(MultipartHttpServletRequest request, @PathVariable
    int type)
    {

        // 1. build an iterator
        Iterator<String> itr = request.getFileNames();
        MultipartFile mpf = null;
        // 2. get each file
        while (itr.hasNext())
        {

            // 2.1 get next MultipartFile
            mpf = request.getFile(itr.next());

            String defPath = "";
            int width = 800;
            int height = 480;
            boolean forceResize = false;
            switch (type)
            {
            case 1:// 用户
                defPath = Constants.DEFAULT_AVATAR_PATH;
                break;
            case 2:// 公告图片
                defPath = Constants.DEFAULT_NOTI_PATH;
                break;
            case 3:// 活动图片
                defPath = Constants.DEFAULT_PARTY_PATH;
                break;
            case 4:// 公司logo
                defPath = Constants.DEFAULT_LOGO_PATH;
                width = 200;
                height = 200;
                break;
            case 5:// 产品图片
                defPath = Constants.DEFAULT_PRODUCTION_PATH;
                forceResize = true;
                break;
            case 6:// 机构logo
                defPath = Constants.DEFAULT_ORGANIZATION_PATH;
                width = 200;
                height = 200;
                break;
            case 7:// 广告位图片
                defPath = Constants.DEFAULT_AD_PATH;
                width = 800;
                height = 800;
                break;
            case 8:// 诗图片
                defPath = Constants.DEFAULT_MODEL_PATH;
                width = 800;
                height = 800;
                break;
            case 9:// 诗作者图片
                defPath = Constants.DEFAULT_AUTHOR_PATH;
                width = 800;
                height = 800;
                break;
            default:
            }
            // copy file to local disk (make sure the path "e.g. D:/temp/files"
            // exists)
            // FileCopyUtils.copy(mpf.getBytes(), new
            // FileOutputStream("D:/temp/files/"+mpf.getOriginalFilename()));
            String originalFileName = mpf.getOriginalFilename(); // 用户上传图片名称
            logger.debug("原图片名：" + originalFileName);
            String subfix = originalFileName.substring(originalFileName
                    .lastIndexOf(".")); // 获取图片后缀

            String fileName = UUID.randomUUID() + subfix; // 图片重命名
            logger.debug("新图片名：" + fileName);
            String path = defPath + fileName;// 构建图片保存的路径

            File dirFile = new File(request.getSession().getServletContext()
                    .getRealPath(defPath));
            // 创建目录
            if (!dirFile.exists())
            {
                dirFile.mkdirs();
            }

            // 得到图片保存目录的真实路径
            String realpath = request.getSession().getServletContext()
                    .getRealPath(path);
            logger.debug("realpath：" + realpath);

            String urlPath = request.getScheme() + "://"
                    + request.getServerName() + ":" + request.getServerPort(); // url路径
            logger.debug("urlPath：" + urlPath);

            // 2.2 if files > 10 remove the first from the list
            // if(files.size() >= 10)
            // files.pop();

            // 2.3 create new fileMeta
            fileMeta = new FileMeta();
            // fileMeta.setFileName(mpf.getOriginalFilename());
            fileMeta.setFileName(fileName); // 文件名
            fileMeta.setFileSize(mpf.getSize() / 1024 + " Kb");
            fileMeta.setFileType(mpf.getContentType());
            fileMeta.setFilePath(urlPath + path);

            try
            {
                fileMeta.setBytes(mpf.getBytes());

                FileOutputStream fps = new FileOutputStream(realpath);
                FileCopyUtils.copy(mpf.getBytes(), fps);
                // 图片等比例压缩
                ImageUtils.resizeImg(realpath, realpath, width, height, true,
                        forceResize);

            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
            // 2.4 add to files
            // files.add(fileMeta);
        }
        // result will be like this
        // [{"fileName":"app_engine-85x77.png","fileSize":"8 Kb","fileType":"image/png"},...]
        return fileMeta;
        // return files;
    }

    /**
     * 
     * TODO(方法简述,后面的"."号不要去除).
     * <p>
     * 方法详细说明,如果要换行请使用<br>
     * 标签
     * </p>
     * <br>
     * author: 周震 date: 2015年9月25日 下午3:08:35
     * 
     * @param request
     * @return
     */
    @RequestMapping(value = "/upload/apk", method = RequestMethod.POST)
    public @ResponseBody
    FileMeta uploadApk(MultipartHttpServletRequest request)
    {
        String urlPath = request.getScheme() + "://" + request.getServerName()
                + ":" + request.getServerPort() + "/"; // url路径
        if (request instanceof MultipartHttpServletRequest)
        {
            MultipartHttpServletRequest fileRequest = (MultipartHttpServletRequest) request;
            File dirFile = new File(request.getSession().getServletContext()
                    .getRealPath(Constants.DEFAULT_APK_PATH));
            // 创建目录
            if (!dirFile.exists())
            {
                dirFile.mkdirs();
            }
            Iterator<String> itr = fileRequest.getFileNames();
            while (itr.hasNext())
            {
                MultipartFile mpf = fileRequest.getFile(itr.next());
                String originalFilename = mpf.getOriginalFilename();
                String path = Constants.DEFAULT_APK_PATH + originalFilename;// 构建APK保存的路径
                // 得到APK保存目录的真实路径
                String realpath = request.getSession().getServletContext()
                        .getRealPath(path);
                FileInputStream in = null;
                FileOutputStream out = null;
                fileMeta = new FileMeta();
                // fileMeta.setFileName(mpf.getOriginalFilename());
                fileMeta.setFileName(originalFilename); // 文件名
                fileMeta.setFileSize(mpf.getSize() / 1024 + " Kb");
                fileMeta.setFileType(mpf.getContentType());
                fileMeta.setFilePath(urlPath + path);
                // 拿到上传文件的输入流
                try
                {
                    in = (FileInputStream) mpf.getInputStream();
                    out = new FileOutputStream(realpath);
                    int length = 0;
                    byte[] b = new byte[1024];
                    while ((length = in.read(b)) > 0)
                    {
                        out.write(b, 0, length);
                    }
                    out.flush();
                }
                catch (Exception e)
                {
                    e.printStackTrace();
                }
                finally
                {
                    try
                    {
                        out.close();
                        in.close();
                    }
                    catch (Exception e)
                    {
                        e.printStackTrace();
                    }
                }
            }
        }
        return fileMeta;

    }

    /***************************************************
     * URL: /controller/del/{type} get(): get file as an attachment
     * 
     * @param fileName
     *            : passed by the server
     * @param type
     *            : type from the URL
     * @return void
     ****************************************************/
    @RequestMapping(value = "/del/{type}/{fileName}", method = RequestMethod.GET)
    public @ResponseBody
    Map<String, Object> del(@PathVariable
    String fileName, @PathVariable
    int type)
    {
        Map<String, Object> map = new HashMap<String, Object>();
        String defPath = "";
        switch (type)
        {
        case 1:
            defPath = Constants.DEFAULT_INFO_PATH;
            break;
        case 2:
            defPath = Constants.DEFAULT_NOTI_PATH;
            break;
        default:
        }
        boolean bool = FileUtils.deleteFile(defPath + fileName);
        if (bool)
        {
            map.put("code", "200");
        }
        else
        {
            map.put("code", "401");
            map.put("message", "文件删除失败");
        }
        return map;
    }

    /***************************************************
     * URL: /controller/get/{value} get(): get file as an attachment
     * 
     * @param response
     *            : passed by the server
     * @param value
     *            : value from the URL
     * @return void
     ****************************************************/
    @RequestMapping(value = "/get/{value}", method = RequestMethod.GET)
    public void get(HttpServletResponse response, @PathVariable
    String value)
    {
        FileMeta getFile = files.get(Integer.parseInt(value));
        try
        {
            response.setContentType(getFile.getFileType());
            response.setHeader("Content-disposition", "attachment; filename=\""
                    + getFile.getFileName() + "\"");
            FileCopyUtils.copy(getFile.getBytes(), response.getOutputStream());
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }
}
