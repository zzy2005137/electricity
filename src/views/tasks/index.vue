<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.type"
        placeholder="任务ID"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-input
        v-model="listQuery.device_no"
        placeholder="设备ID"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      /> -->
      <!-- <el-select
        v-model="listQuery."
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
      </el-select> -->
      <el-select
        v-model="listQuery.status"
        placeholder="检测状态"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in queryOptions.statusOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.district"
        placeholder="检测机构"
        clearable
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in queryOptions.districtOptions"
          :key="item"
          :label="item"
          :value="item"
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
        type="success"
        icon="el-icon-plus"
        @click="addNodedialogVisible = true"
      >
        添加
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="warning"
        icon="el-icon-edit"
        @click="handleDownload"
      >
        编辑
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="检测机构">
        <template slot-scope="scope">
          {{ scope.row.district_id == 1 ? "省中心（电科院）" : "" }}
        </template>
      </el-table-column>
      <el-table-column label="物资品类">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        label="任务状态"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{
            scope.row.status
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="created_at"
        label="更新时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updatetime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="试验集合">
        <el-button
          :v-if="show"
          type="edit"
          size="mini"
          @click="dialogVisibleExperiments = true"
        >
          点击展开
        </el-button>
      </el-table-column>
      <el-table-column label="上链信息">
        <el-button
          :v-if="show"
          type="primary"
          size="mini"
          @click="dialogVisible = true"
        >
          查看详情
        </el-button>
      </el-table-column>
    </el-table>

    <el-dialog
      title="上链信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
        >
          <p>交易ID：{{ activity.transaction_id }}</p>
          <p>数据哈希：{{ activity.data_hash }}</p>
        </el-timeline-item>
      </el-timeline>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="试验集合"
      :visible.sync="dialogVisibleExperiments"
      :before-close="handleClose"
    >
      <el-table
        v-loading="listLoading"
        :data="experiments"
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="ID" width="95">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="任务id">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="试验名称">
          <template slot-scope="scope">
            {{ scope.row.e_name }}
          </template>
        </el-table-column>

        <el-table-column
          class-name="status-col"
          label="试验结果"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{
              scope.row.conclusion
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="created_at" label="更新时间">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.update_at }}</span>
          </template>
        </el-table-column>

        <el-table-column label="上链信息">
          <el-button
            :v-if="show"
            type="primary"
            size="mini"
            @click="dialogVisible = true"
          >
            查看详情
          </el-button>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
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
      listQuery: {},
      activities: [
        {
          transaction_id:
            "0fa5db699d9f8aed7c75b478b2876a37bdbd0a5b819f4b9b52c6c8d63a1d2eb3",
          data_hash:
            "	06120358e39a1ee7dd29dcc77f48cc4444741df07c0381e24f4a240b600cf179",
          status: "待解决",
          timestamp: "2022-12-10T10:47:02.653Z",
        },
        {
          transaction_id:
            "0fa5db699d9f8aed7c75b478b2876a37bdbd0a5b819f4b9b52c6c8d63a1d2eb3",
          data_hash:
            "	06120358e39a1ee7dd29dcc77f48cc4444741df07c0381e24f4a240b600cf179",
          status: "已解决",
          timestamp: "2022-12-11T10:47:02.653Z",
        },
      ],
      dialogVisible: false,
      dialogVisibleExperiments: false,
      list: [
        {
          district_id: 1, // 机构
          status: "待检",
          type: "低压开关柜",
          updatetime: "2022-11-11 19:13",
        },
        {
          district_id: 1, // 机构
          status: "在检",
          type: "电力电缆",
          updatetime: "2022-11-11 19:13",
        },
      ],
      experiments: [
        {
          e_name: "主回路交流耐压试验",
          id: "202185",
          update_at: "2022-11-11 19:33",
          conclusion: "合格",
        },
        {
          e_name: "温升试验",
          id: "212085",
          update_at: "2022-11-11 19:33",
          conclusion: "合格",
        },
        {
          e_name: "介质损耗试验",
          id: "212085",
          update_at: "2022-11-11 19:33",
          conclusion: "合格",
        },
      ],
      listLoading: false,
      listQuery: {
        status: "",
        type: "",
        district: "",
      },
      queryOptions: {
        districtOptions: [
          "苏北分中心",
          "苏南分中心",
          "苏中分中心",
          "省中心（电科院）",
        ],
        statusOptions: ["已检", "待检", "在检"],
        type: ["低压开关柜", "电力电缆"],
      },
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
  methods: {
    fetchData() {
      this.listLoading = true;
      getList().then((response) => {
        this.list = response.data.items;
        this.listLoading = false;
      });
    },
  },
};
</script>
