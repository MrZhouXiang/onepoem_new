package com.puyun.myshop.daoImpl;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import com.iuvei.framework.jdbc.ZeroJdbcDaoSupport;
import com.puyun.myshop.dao.BaseDao;

public abstract class BaseDaoImpl implements BaseDao{
	private ZeroJdbcDaoSupport daoSupport = null;
	public ZeroJdbcDaoSupport getDaoSupport() {
		return daoSupport;
	}

	public void setDaoSupport(ZeroJdbcDaoSupport daoSupport) {
		this.daoSupport = daoSupport;
	}

	public PreparedStatement getPreparedStatement(String sql){

		PreparedStatement pstat= null;
		try {
            Connection conn = getDaoSupport().getDataSource().getConnection();
			pstat = conn.prepareStatement(sql);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return pstat;
	}

    public void closeConnection(PreparedStatement pstat,Connection conn){

        try {
            if(pstat!=null){
                pstat.close();
            }
            if(conn!=null){
                conn.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}

