<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="节点名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.importance"
        placeholder="ID"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option
          v-for="item in importanceOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name + '(' + item.key + ')'"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="labInfo"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="节点名称" prop="name"> </el-table-column>
      <el-table-column label="节点类型" prop="type"> </el-table-column>
      <el-table-column label="所属机构" prop="district"> </el-table-column>
      <el-table-column label="节点URL" prop="url"> </el-table-column>
      <el-table-column label="创建时间" prop="create_at"> </el-table-column>
      <el-table-column label="证书信息">
        <el-button
          :v-if="show"
          type="primary"
          size="mini"
          @click="dialogVisible = true"
        >
          下载
        </el-button>
      </el-table-column>
    </el-table>

    <el-dialog
      title="上链信息"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <!-- <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
        >
          <p>交易ID：{{ activity.transaction_id }}</p>
          <p>数据哈希：{{ activity.data_hash }}</p>
        </el-timeline-item>
      </el-timeline> -->
      <p>证书信息</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getList } from "@/api/table";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "机构",
      },
      activities: [
        {
          transaction_id:
            "0fa5db699d9f8aed7c75b478b2876a37bdbd0a5b819f4b9b52c6c8d63a1d2eb3",
          data_hash:
            "	06120358e39a1ee7dd29dcc77f48cc4444741df07c0381e24f4a240b600cf179",
          timestamp: "2022-12-10T10:47:02.653Z",
        },
      ],
      dialogVisible: false,
      listLoading: false,
      labInfo: [
        {
          name: "苏北分中心peer节点",
          type: "PEER",
          district: "苏北分中心",
          url: "peer0.org1.com",
          create_at: "2022-12-10T10:47:02.653Z",
        },
        {
          name: "苏北分中心order节点",
          type: "ORDER",
          district: "苏北分中心",
          url: "order0.org1.com",
          create_at: "2022-12-10T10:47:02.653Z",
        },
        {
          name: "苏南分中心peer节点",
          type: "PEER",
          district: "苏南分中心",
          url: "peer0.org1.com",
          create_at: "2022-12-10T10:47:02.653Z",
        },
        {
          name: "苏中分中心order节点",
          type: "ORDER",
          district: "苏中分中心",
          url: "order0.org1.com",
          create_at: "2022-12-10T10:47:02.653Z",
        },
        {
          name: "省中心电科院peer节点",
          type: "PEER",
          district: "省中心电科院",
          url: "peer0.org1.com",
          create_at: "2022-12-10T10:47:02.653Z",
        },
        {
          name: "省中心电科院中心order节点",
          type: "ORDER",
          district: "省中心电科院",
          url: "order0.org1.com",
          create_at: "2022-12-10T10:47:02.653Z",
        },
      ],
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
  created() {
    // this.fetchData();
  },
};
</script>

<style scoped>
.filter-container {
  margin-bottom: 1.5rem;
}

.filter-container * {
  margin-right: 1rem;
}
</style>
