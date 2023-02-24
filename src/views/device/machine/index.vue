<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="labInfo"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="机构" prop="district_id"> </el-table-column>
      <el-table-column label="设备ID" prop="device_no"> </el-table-column>
      <el-table-column label="工位编号" prop="station_token"> </el-table-column>
      <el-table-column label="设备名称" prop="name"> </el-table-column>
      <el-table-column label="型号" prop="model_number"> </el-table-column>
      <el-table-column label="资产编号" prop="zcbh"> </el-table-column>
      <el-table-column label="生产厂家" prop="company"> </el-table-column>
      <el-table-column label="创建时间" prop="createtime"> </el-table-column>
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
          district_id: "省中心（电科院）",
          device_no: "46",
          station_token: "A6",
          model_number: "TM2-008",
          company: "上海思创电力设备有限公司",
          createtime: "2022-01-14 19:22",
          experiment_ids: "19,18,3,10",
          zcbh: "F1181101",
          name: "三相变频电源模块",
        },
        {
          district_id: "省中心（电科院）",
          device_no: "46",
          station_token: "A6",
          model_number: "TM2-008",
          company: "上海思创电力设备有限公司",
          createtime: "2022-01-14 19:22",
          experiment_ids: "19,18,3,10",
          zcbh: "F1181101",
          name: "变压器测量切换线模块",
        },
        {
          district_id: "省中心（电科院）",
          device_no: "46",
          station_token: "A6",
          model_number: "TM2-008",
          company: "上海思创电力设备有限公司",
          createtime: "2022-01-14 19:22",
          experiment_ids: "19,18,3,10",
          zcbh: "F1181101",
          name: "电压电流测试仪",
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
