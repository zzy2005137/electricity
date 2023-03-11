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
      :data="machines"
     
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="机构" prop="district_id"> </el-table-column>
      <el-table-column label="设备ID" prop="device_no"> </el-table-column>
      <el-table-column label="工位编号" prop="station_token"> </el-table-column>
      <el-table-column label="设备名称" prop="name"> </el-table-column>
      <el-table-column label="型号" prop="model_number"> </el-table-column>
      <el-table-column label="资产编号" prop="zcbh"> </el-table-column>
      <el-table-column label="生产厂家" prop="company"> </el-table-column>
      <el-table-column label="创建时间" prop="createtime"> </el-table-column> -->
      <el-table-column label="被检测设备名称" prop="name"> </el-table-column>
      <el-table-column label="检测项目名称" prop="district_id"> </el-table-column>
      <el-table-column label="依据的标准" prop="device_no"> </el-table-column>
      <el-table-column label="标准编号(含年号)" prop="station_token"> </el-table-column>
      <el-table-column label="检测工具" prop="zcbh"> </el-table-column>
      <el-table-column label="工具型号/规格/等级" prop="model_number"> </el-table-column>
      <el-table-column label="有效日期" prop="createtime"> </el-table-column>
      <el-table-column label="确认结果" prop="company"> </el-table-column>
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

        <el-form-item label="被检测设备名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="依据的标准">
          <el-input v-model="form.device_no"></el-input>
        </el-form-item>
        <el-form-item label="标准编号">
          <el-input v-model="form.station_token"></el-input>
        </el-form-item>
        
        <el-form-item label="工具型号">
          <el-input v-model="form.model_number"></el-input>
        </el-form-item>
        <el-form-item label="检测工具">
          <el-input v-model="form.zcbh"></el-input>
        </el-form-item>
        <el-form-item label="确认结果">
          <el-input v-model="form.company"></el-input>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="addMachine">立即创建</el-button>
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
import addForm from "./form.vue";
export default {
  components: {
    addForm,
  },
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
      form: {
        district_id: "省中心(电科院)",
        device_no: "低压成套开关设备和控制设备",
        station_token: "GB/T 7251.12.2013",
        model_number: "AN9643M",
        company: "合格",
        createtime: "/",
        experiment_ids: "19,18,3,10",
        zcbh: "耐压绝缘测试仪",
        name: "合配电箱",
      },
      machines: [
        {
         district_id: "介电性能",
        device_no: "低压成套开关设备和控制设备",
        station_token: "GB/T 7251.12.2013",
        model_number: "AN9643M",
        company: "/",
        createtime: "/",
        experiment_ids: "19,18,3,10",
        zcbh: "耐压绝缘测试仪",
        name: "合配电箱",
        },
        {
          district_id: "工频过电压保护",
          device_no: "低压成套开关设备和控制设备",
          station_token: "GB/T 7251.12.2013",
          model_number: "/",
          company: "/",
          createtime: "2022-01-14 19:22",
          experiment_ids: "19,18,3,10",
          zcbh: "/",
          name: "合配电箱",
        },
        {
          district_id: "机械碰撞实验",
          device_no: "电器设备外壳对外界机械碰撞的防护等级(IK代码)",
          station_token: "GB/T 20138-2006",
          model_number: "/",
          company: "符合",
          createtime: "2022-01-14 19:22",
          experiment_ids: "19,18,3,10",
          zcbh: "碰撞试验台",
          name: "合配电箱",
        },
        {
          district_id: "工频参考电压实验",
          device_no: "交流无间隙金属氧化物避雷器",
          station_token: "GB/T 11032-2020",
          model_number: "RCM2500",
          company: "符合",
          createtime: "2022-8-24",
          experiment_ids: "19,18,3,10",
          zcbh: "氧化锌阻性电流测试仪",
          name: "交流避雷器",
        },
        {
          district_id: "密封实验",
          device_no: "交流无间隙金属氧化物避雷器",
          station_token: "GB/T 20138-2006",
          model_number: "JUS-10",
          company: "符合",
          createtime: "2023-5-29",
          experiment_ids: "19,18,3,10",
          zcbh: "密封实验装置(水煮箱)",
          name: "交流避雷器",
        },
         {
          district_id: "冲击载荷实验",
          device_no: "低压成套开关设备和控制设备",
          station_token: "GB/T 7251.1-2013",
          model_number: "YWX-10",
          company: "符合",
          createtime: "/",
          experiment_ids: "19,18,3,10",
          zcbh: "电能计量箱表外壳冲击实验机",
          name: "电能计量箱",
        },
      ],
      // mergeItems:[
      //   {columnIndex:0,apanArr:[],pos:0,prop:"name"}
      // ],
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
    };
  },
  // computed: {
  //   queryOptions() {
  //     let districtOptions = this.createOptions("district");
  //     let typeOptions = this.createOptions("type");
  //     return {
  //       districtOptions,
  //       typeOptions,
  //     };
  //   },
  // },
  methods: {
    addMachine() {
      this.form.createtime = new Date().toISOString();
      let obj = { ...this.form };
      this.machines.push(obj);
      this.addDialogVisible = false;

      this.$message({
        message: "添加成功",
        type: "success",
      });
    },
    handleRegister() {
      this.machines.push(this.machines[this.machines.length - 1]);
      this.addDialogVisible = false;
    },
    handleFilter() {
      console.log("handleFilter");
      let { name, station_token, district, device_no } = this.listQuery;
      this.filtermachines = this.machines.filter((item) => {
        if (name && item.name.indexOf(name) < 0) return false;
        if (device_no && item.device_no.indexOf(device_no) < 0) return false;
        if (district && item.district !== district) return false;
        if (station_token && item.station_token !== station_token) return false;
        return true;
      });
    },
    createOptions(key) {
      let optionSet = new Set();
      this.machines.forEach((obj) => {
        optionSet.add(obj[key]);
      });
      return Array.from(optionSet);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    fetchData() {
      this.listLoading = true;
      getList().then((response) => {
        this.list = response.data.items;
        this.listLoading = false;
      });
    },
  },
  created() {
    // this.fetchData();
  },
};
</script>
