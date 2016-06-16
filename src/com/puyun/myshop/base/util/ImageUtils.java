package com.puyun.myshop.base.util;

//import com.sun.image.codec.jpeg.JPEGCodec;
//import com.sun.image.codec.jpeg.JPEGEncodeParam;
//import com.sun.image.codec.jpeg.JPEGImageEncoder;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.WritableRaster;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by AI-MASK on 14-7-21.
 */
public class ImageUtils
{
    /**
     * 等比例压缩图片文件<br>
     * 先保存原文件，再压缩、上传
     * 
     * @param oldFile 要进行压缩的文件
     * @param newFile 新文件
     * @param width 宽度 //设置宽度时（高度传入0，等比例缩放）
     * @param height 高度 //设置高度时（宽度传入0，等比例缩放）
     * @param quality 质量
     * @return 返回压缩后的文件的全路径
     */
    public static String zipImageFile(File oldFile, File newFile, int width, int height, float quality)
    {
        if (oldFile == null)
        {
            return null;
        }
        try
        {
            /** 对服务器上的临时文件进行处理 */
            Image srcFile = ImageIO.read(oldFile);
            int w = srcFile.getWidth(null);
            // System.out.println(w);
            int h = srcFile.getHeight(null);
            // System.out.println(h);
            double ratio;
            
            if (w / h > width / height)
            {
                ratio = width / (double)w;
                height = (int)(h * ratio);
            }
            else
            {
                ratio = height / (double)h;
                width = (int)(w * ratio);
            }
            /** 宽,高设定 */
            BufferedImage tag = new BufferedImage(width, height, BufferedImage.TYPE_INT_BGR);
            tag.getGraphics().drawImage(srcFile, 0, 0, width, height, null);
            // String filePrex = oldFile.getName().substring(0, oldFile.getName().indexOf('.'));
            /** 压缩后的文件名 */
            // newImage = filePrex + smallIcon+ oldFile.getName().substring(filePrex.length());
            
            /** 压缩之后临时存放位置 */
            // FileOutputStream out = new FileOutputStream(newFile);
            String _newFilePath = newFile.getAbsolutePath();
            String formatName = _newFilePath.substring(_newFilePath.lastIndexOf(".") + 1);
            // JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
            // JPEGEncodeParam jep = JPEGCodec.getDefaultJPEGEncodeParam(tag);
            /** 压缩质量 */
            // jep.setQuality(quality, true);
            ImageIO.write(tag, /* "GIF" */formatName /* format desired */, new File(_newFilePath) /* target */);
            // encoder.encode(tag, jep);
            // out.close();
            
        }
        catch (FileNotFoundException e)
        {
            e.printStackTrace();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        return newFile.getAbsolutePath();
    }
    
    /**
     * 按固定高度压缩图片文件<br>
     * 先保存原文件，再压缩、上传
     * 
     * @param oldFile 要进行压缩的文件全路径
     * @param newFile 新文件
     * @param width 宽度
     * @param height 高度
     * @param quality 质量
     * 
     *            <pre>
     * Some guidelines: 0.75 high quality 0.5  medium quality 0.25 low quality
     * </pre>
     * @return 返回压缩后的文件的全路径
     */
    public static String zipWidthHeightImageFile(File oldFile, File newFile, int width, int height, float quality)
    {
        if (oldFile == null)
        {
            return null;
        }
        String newImage = null;
        try
        {
            /** 对服务器上的临时文件进行处理 */
            Image srcFile = ImageIO.read(oldFile);
            /** 宽,高设定 */
            BufferedImage tag = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            tag.getGraphics().drawImage(srcFile, 0, 0, width, height, null);
            // String filePrex = oldFile.substring(0, oldFile.indexOf('.'));
            /** 压缩后的文件名 */
            // newImage = filePrex + smallIcon+ oldFile.substring(filePrex.length());
            /** 压缩之后临时存放位置 */
            // FileOutputStream out = new FileOutputStream(newFile);
            String _newFilePath = newFile.getAbsolutePath();
            String formatName = _newFilePath.substring(_newFilePath.lastIndexOf(".") + 1);
            // JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
            // JPEGEncodeParam jep = JPEGCodec.getDefaultJPEGEncodeParam(tag);
            /** 压缩质量 */
            // jep.setQuality(quality, true);
            ImageIO.write(tag, /* "GIF" */formatName /* format desired */, new File(_newFilePath) /* target */);
            // encoder.encode(tag, jep);
            // out.close();
        }
        catch (FileNotFoundException e)
        {
            e.printStackTrace();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        return newImage;
    }
    
    /**
     * 生成缩略图 fromFileStr:原图片路径 saveToFileStr:缩略图路径 width:缩略图的宽 height:缩略图的高
     * @param from 原图片路径
     * @param to 缩略图路径
     * @param width 缩略图的宽
     * @param height 缩略图的高
     * @param equalProportion 锁定纵横比
     * @throws Exception
     * @see [类、类#方法、类#成员]
     */
    public static void resizeImg(String from, String to, int width, int height, boolean equalProportion, boolean forceResize)
        throws Exception
    {
        BufferedImage srcImage;
        String imgType = "JPEG";
        if (from.toLowerCase().endsWith(".png"))
        {
            imgType = "PNG";
        }
        File fromFile = new File(from);
        File saveFile = new File(to);
        srcImage = ImageIO.read(fromFile);
        if (width > 0 || height > 0)
        {
            srcImage = resize(srcImage, width, height, equalProportion, forceResize);
        }
        ImageIO.write(srcImage, imgType, saveFile);
    }
    
    /**
     * 将原图片的BufferedImage对象生成缩略图 source：原图片的BufferedImage对象 targetW:缩略图的宽 targetH:缩略图的高
     */
    public static BufferedImage resize(BufferedImage source, int targetW, int targetH, boolean equalProportion,boolean forceResize)
    {
        int type = source.getType();
        BufferedImage target = null;
        if(forceResize)//强制改变图片大小
        {
        } else {
            targetW = targetW < source.getWidth() ? targetW : source.getWidth();
            targetH = targetH < source.getHeight() ? targetH : source.getHeight();
        }
        double sx = (double)targetW / source.getWidth();
        double sy = (double)targetH / source.getHeight();
        // 这里想实现在targetW，targetH范围内实现等比例的缩放
        // 如果不需要等比例的缩放则下面的if else语句注释调即可
        if (equalProportion)
        {
            if (sx > sy)
            {
                sx = sy;
                targetW = (int)(sx * source.getWidth());
            }
            else
            {
                sy = sx;
                targetH = (int)(sx * source.getHeight());
            }
        }
        if (type == BufferedImage.TYPE_CUSTOM)
        {
            ColorModel cm = source.getColorModel();
            WritableRaster raster = cm.createCompatibleWritableRaster(targetW, targetH);
            boolean alphaPremultiplied = cm.isAlphaPremultiplied();
            target = new BufferedImage(cm, raster, alphaPremultiplied, null);
        }
        else
        {
            target = new BufferedImage(targetW, targetH, type);
            Graphics2D g = target.createGraphics();
            g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            g.drawRenderedImage(source, AffineTransform.getScaleInstance(sx, sy));
            g.dispose();
        }
        return target;
    }
    
    public static void main(String[] args)
        throws Exception
    {
        
        ImageUtils.zipImageFile(new File("d:\\bb.jpg"), new File("d:\\bb.jpg"), 600, 400, 0.75f);
    }
}
