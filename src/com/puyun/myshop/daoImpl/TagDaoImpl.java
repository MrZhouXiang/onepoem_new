package com.puyun.myshop.daoImpl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import com.puyun.myshop.dao.DynastyDao;
import com.puyun.myshop.dao.TagDao;
import com.puyun.myshop.entity.DynastyMod;
import com.puyun.myshop.entity.TagMod;

/**
 * 朝代处理
 */
public class TagDaoImpl extends BaseDaoImpl implements TagDao
{
    private JdbcTemplate jdbcTemplate;

    private NamedParameterJdbcTemplate namedJdbcTemplate;

    private static final Logger logger = Logger.getLogger(TagDaoImpl.class);

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

	@Override
	public List<TagMod> getTagList() {
		// TODO Auto-generated method stub
		String sql = "select * from tag_t";
        List<TagMod> list = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<TagMod>(TagMod.class));
        return list;
	}


}
