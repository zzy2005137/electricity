<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="设备名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.device_no"
        placeholder="设备ID"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
        v-model="listQuery.station_token"
        placeholder="工位编号"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in queryOptions.stationOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.district"
        placeholder="所属机构"
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
        @click="addDialogVisible = true"
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
      <!-- <el-table-column label="设备名称" prop="device_no"> </el-table-column> -->
      <el-table-column label="工位编号" prop="station_token"> </el-table-column>
      <el-table-column label="设备名称" prop="device_no"> </el-table-column>
      <el-table-column label="型号" prop="model_number"> </el-table-column>
      <el-table-column label="编号" prop="zcbh"> </el-table-column>
      <el-table-column label="生产厂家" prop="company"> </el-table-column>
      <el-table-column label="计量校准单位" prop="experiment_ids">
      </el-table-column>
      <el-table-column label="证书有效时间" prop="createtime"> </el-table-column>
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

    <el-dialog title="添加工位" :visible.sync="addDialogVisible">
      <el-form :model="form" label-width="100px" class="add-form">
        <el-form-item label="检测机构">
          <el-select v-model="form.district_id" class="filter-item">
            <el-option
              v-for="item in queryOptions.districtOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="form.device_no"></el-input>
        </el-form-item>
        <el-form-item label="工位编号">
          <el-input v-model="form.station_token"></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="form.model_number"></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="form.zcbh"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="form.company"></el-input>
        </el-form-item>
        <el-form-item label="计量校准单位">
          <el-input v-model="form.experiment_ids"></el-input>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="addStation">立即创建</el-button>
          <el-button @click="addDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStation">确 定</el-button>
      </span> -->
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
      addDialogVisible: false,
      listLoading: false,
      labInfo: [
        {
          district_id: "省中心（电科院）",
          device_no: "全自动变比测试仪",
          station_token: "工位一",
          model_number: "CVT2300A",
          company: "上海思创电力设备有限公司",
          createtime: "2022-01-14 19:22",
          experiment_ids: "国家高电压计量站",
          zcbh: "2030001A",
        },
        {
          district_id: "省中心（电科院）",
          device_no: "直流电阻测试模块",
          station_token: "工位一",
          model_number: "TM2-008",
          company: "上海思创电力设备有限公司",
          createtime: "2022-01-14 19:22",
          experiment_ids: "国家高电压计量站",
          zcbh: "Z200002A",
        },
        {
          district_id: "省中心（电科院）",
          device_no: "变压器参数设置仪",
          station_token: "工位一",
          model_number: "DS-2001",
          company: "上海思创电力设备有限公司",
          createtime: "2022-01-14 19:22",
          experiment_ids: "国家高电压计量站",
          zcbh: "14080701",
        },
        {
          district_id: "省中心（电科院）",
          device_no: "声级仪(探头8个)",
          station_token: "工位二",
          model_number: "AWA5661",
          company: "上海思创电力设备有限公司",
          createtime: "2022-01-14 19:22",
          experiment_ids: "江苏省计量科学研究院",
          zcbh: "078684",
        },
        {
          district_id: "省中心（电科院）",
          device_no: "有载分接开关测试仪",
          station_token: "工位二",
          model_number: "HCYZ-III",
          company: "上海思创电力设备有限公司",
          createtime: "2022-01-14 19:22",
          experiment_ids: "国家高电压计量站",
          zcbh: "Z300001A",
        },
      ],
      listQuery: {
        name: "",
        district: "",
        station_token: "",
        device_no: "",
      },
      queryOptions: {
        districtOptions: [
          "苏北分中心",
          "苏南分中心",
          "苏中分中心",
          "省中心（电科院）",
        ],
        stationOptions: ["工位一", "工位二","工位三"],
      },
      form: {
        district_id: "省中心（电科院）",
        device_no: "温度记录仪",
        station_token: "工位一",
        model_number: "USB1608",
        company: "上海思创电力设备有限公司",
        createtime: "2022-01-14 19:22",
        experiment_ids: "江苏省计量科学研究院",
        zcbh: "F1181101",
      },
    };
  },
  methods: {
    addStation() {
      this.form.createtime = new Date().toISOString();
      let obj = { ...this.form };
      this.labInfo.push(obj);
      this.addDialogVisible = false;

      this.$message({
        message: "添加成功",
        type: "success",
      });
    },
    fetchData() {
      this.listLoading = true;
      getList().then((response) => {
        this.list = response.data.items;
        this.listLoading = false;
      });
    },
    handleFilter() {
      console.log("handleFilter");
      let { name, station_token, district, device_no } = this.listQuery;
      this.filterLabInfo = this.labInfo.filter((item) => {
        if (name && item.name.indexOf(name) < 0) return false;
        if (device_no && item.device_no.indexOf(device_no) < 0) return false;
        if (district && item.district !== district) return false;
        if (station_token && item.station_token !== station_token) return false;
        return true;
      });
    },
    createOptions(key) {
      let optionSet = new Set();
      this.labInfo.forEach((obj) => {
        optionSet.add(obj[key]);
      });
      return Array.from(optionSet);
    },
  },
};
</script>

<style scoped>
.add-form {
  /* width: 60%; */
}
</style>
