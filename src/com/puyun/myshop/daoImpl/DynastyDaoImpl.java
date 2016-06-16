package com.puyun.myshop.daoImpl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import com.puyun.myshop.dao.DynastyDao;
import com.puyun.myshop.entity.DynastyMod;

/**
 * 朝代处理
 */
public class DynastyDaoImpl extends BaseDaoImpl implements DynastyDao
{
    private JdbcTemplate jdbcTemplate;

    private NamedParameterJdbcTemplate namedJdbcTemplate;

    private static final Logger logger = Logger.getLogger(DynastyDaoImpl.class);

    public JdbcTemplate getJdbcTemplate()
    {
        return this.jdbcTemplate;
    }

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate)
    {
        this.jdbcTemplate = jdbcTemplate;
        this.namedJdbcTemplate = new NamedParameterJdbcTemplate(
                jdbcTemplate.getDataSource());
    }

    //
    // @Override
    // public List<AuthorMod> getAuthorList(int id, int size)
    // {
    // // TODO Auto-generated method stub
    // String sql = "select * from author_t";
    // List<AuthorMod> list = jdbcTemplate.query(sql,
    // new BeanPropertyRowMapper<AuthorMod>(AuthorMod.class));
    // return list;
    // }

    @Override
    public List<DynastyMod> getDynastyList(int id, int size)
    {
        String sql = "select * from dynasty_t";
        List<DynastyMod> list = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<DynastyMod>(DynastyMod.class));
        return list;
    }

}
