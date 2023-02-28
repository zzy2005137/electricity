<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="节点名称"
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
        v-model="listQuery.type"
        placeholder="节点类型"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in queryOptions.typeOptions"
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
    <!-- 节点列表 -->
    <el-table
      v-loading="listLoading"
      :data="filterLabInfo"
      
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="节点名称" prop="name"> </el-table-column>
      <el-table-column label="节点类型" prop="type"> </el-table-column>
      <el-table-column label="所属机构" prop="district"> </el-table-column>
      <el-table-column label="节点URL" prop="url"> </el-table-column>
      <el-table-column label="创建时间" prop="createtime"> </el-table-column>
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

      <p>证书信息</p>
    

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="添加新节点" :visible.sync="addNodedialogVisible">
      <!-- <addForm></addForm> -->

      <el-form  :model="form" label-width="120px" class="add-form">

      <el-form-item label="节点名称">
        <el-select
          v-model="form.name"
          placeholder="please select your zone"
        >
          <el-option
            v-for="item in peeroptions"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
          <!-- <el-option label="Zone two" value="beijing" /> -->
        </el-select>
      </el-form-item>

      <el-form-item label="节点类型">
        <el-select
          v-model="form.type"
          placeholder="please select your node_type"
        >
          <el-option
            v-for="item in nodetype"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
          <!-- <el-option label="Zone two" value="beijing" /> -->
        </el-select>
      </el-form-item>

      <el-form-item label="所属机构">
        <el-select
          v-model="form.district"
          placeholder="please select your organization"
        >
          <el-option
            v-for="item in organizations"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
          <!-- <el-option label="Zone two" value="beijing" /> -->
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="节点URL">
        <el-select
          v-model="form.节点URL"
          placeholder="please select your url"
        >
          <el-option
            v-for="item in URL"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->

      <el-form-item label="节点URL">
        <el-col :span="11"> <el-input v-model="form.url" /></el-col>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-col :span="11"> <el-input v-model="form.createtime"  /></el-col>
      </el-form-item>

      <el-form-item class="dialog-footer">
        <el-button @click="addNodedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNode">立即创建</el-button>
      </el-form-item>

    </el-form>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="addNodedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNode">立即创建</el-button
        >
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getList } from "@/api/table";
/* import addForm from "./form.vue";*/

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

      peeroptions:[{
        value:"苏北分中心peer节点",
        label:"苏北分中心peer节点"
      },{
        value:"苏南分中心peer节点",
        label:"苏南分中心peer节点"
      },{
        value:"苏中分中心peer节点",
        label:"苏中分中心peer节点"
      },{
        value:"省中心电科院peer节点",
        label:"省中心电科院peer节点"
      } ],

      nodetype:[{
        value:"PEER",
        label:"PEER"
      },{
        value:"ORDER",
        label:"ORDER"
      }],

      organizations:[{
        value:"苏北分中心",
        label:"苏北分中心"
      },{
        value:"苏南分中心",
        label:"苏南分中心"
      },{
        value:"苏中分中心",
        label:"苏中分中心"
      },{
        value:"省中心电科院",
        label:"省中心电科院"
      } ],

      form: {
        name: "省中心（电科院）",
        type: '',
        district: '',   
        url: "peer1.org0.com",
        createtime:"2023-02-27",
        // 负责人: "宋思齐",
        // 身份ID: "",
        // // privateKey: `MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAg544VsNa20GxLA7UvzmvELY8t390Yc6+wgUQYaaNdefJChmtCHttvz9SOCk4OxkbB3xfFt+IWoFCW7jKtxD7fQIDAQABAkBQOLqsH2wcYaDkcrG3UChlLj45teSwzLu2NDH04vgr2VgDmo/2DHiKvHnF5pbxPob39nc9Kfk/RRlVRkIIy2YdAiEAupfYLrMvuNjUKQCAimo+qGQsZzJsg3uG4doLUF5Nve8CIQC0k2yVLTtCAgpb6kUp9+l5oHbN7669eAf0ESrLOcEJUwIgM+UVT++v/xX286xbE6P25zhtDQp+GZdabSgKa4C+2GsCIQCDDevkaKt1QJ3cD66awv6D813GIIoloJPFIyB31javWQIgFXqEpV7XK03IbXdHmOXSdhbOYr0B5iS3E8uHb+hT7io=`,
        // 公钥: "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKZAtjhCrrUcpM7ZjLkxBRTovRTb3US0VpSVw2sU9MWBIvEuOvHPBeVcWK+HbSV/9ve+DgfrZ+C8heS4C0j09LUCAwEAAQ==",
      },

      listQuery: {
        name: "",
        district: "",
        type: "",
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
      addNodedialogVisible: false,
      listLoading: false,
      labInfo: [
        {
          name: "苏北分中心peer节点",
          type: "PEER",
          district: "苏北分中心",
          url: "peer0.org1.com",
          createtime: "2022-12-10T10:47:02.653Z",
        },
        {
          name: "苏北分中心order节点",
          type: "ORDER",
          district: "苏北分中心",
          url: "order0.org1.com",
          createtime: "2022-12-10T10:47:02.653Z",
        },
        {
          name: "苏南分中心peer节点",
          type: "PEER",
          district: "苏南分中心",
          url: "peer0.org1.com",
          createtime: "2022-12-10T10:47:02.653Z",
        },
        {
          name: "苏中分中心order节点",
          type: "ORDER",
          district: "苏中分中心",
          url: "order0.org1.com",
          createtime: "2022-12-10T10:47:02.653Z",
        },
        {
          name: "省中心电科院peer节点",
          type: "PEER",
          district: "省中心电科院",
          url: "peer0.org1.com",
          createtime: "2022-12-10T10:47:02.653Z",
        },
        {
          name: "省中心电科院中心order节点",
          type: "ORDER",
          district: "省中心电科院",
          url: "order0.org1.com",
          createtime: "2022-12-10T10:47:02.653Z",
        },
      ],
      filterLabInfo: [],
    };
  },
  computed: {
    queryOptions() {
      let districtOptions = this.createOptions("district");
      let typeOptions = this.createOptions("type");
      return {
        districtOptions,
        typeOptions,
      };
    },
  },
  methods: {
    addNode() {
      this.form.createtime = new Date().toISOString();
      let obj = { ...this.form };
      this.labInfo.push(obj);
      this.handleFilter();
      this.addNodedialogVisible = false;

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

    createOptions(key) {
      let optionSet = new Set();

      this.labInfo.forEach((obj) => {
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
    handleFilter() {
      console.log("handleFilter");
      let { name, district, type } = this.listQuery;
      this.filterLabInfo = this.labInfo.filter((item) => {
        if (name && item.name.indexOf(name) < 0) return false;
        if (district && item.district !== district) return false;
        if (type && item.type !== type) return false;
        return true;
      });
    },
  },

  created() {
    // this.fetchData();
    this.handleFilter();
  },
};
</script>

<style scoped>
.add-form {
  /* width: 60%; */
}
</style>