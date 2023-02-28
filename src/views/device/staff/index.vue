<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.number"
        placeholder="工号"
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
        placeholder="职务"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in queryOptions.qtype"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.skill_rank"
        placeholder="技能等级"
        clearable
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in queryOptions.qskill_rank"
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
        @click="addEmployeeDialogVisible = true"
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
      <el-table-column label="姓名" prop="name"> </el-table-column>
      <el-table-column label="性别" prop="sex"> </el-table-column>
      <el-table-column label="工号" prop="number"> </el-table-column>
      <el-table-column label="职务" prop="job"> </el-table-column>
      <el-table-column label="技能等级" prop="skill_rank"> </el-table-column>
      <el-table-column label="类型" prop="type"> </el-table-column>
      <el-table-column label="属性" prop="property">
      </el-table-column>
      <el-table-column label="创建时间" prop="createtime"> </el-table-column>
      <!-- <el-table-column label="上链信息">
        <el-button
          :v-if="show"
          type="primary"
          size="mini"
          @click="dialogVisible = true"
        >
          查看详情
        </el-button>
      </el-table-column> -->
    </el-table>

    <!-- <el-dialog
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
    </el-dialog> -->

    <el-dialog title="添加员工" :visible.sync="addEmployeeDialogVisible">
      <el-form :model="form" label-width="100px" class="add-form">
        <!-- <el-form-item label="检测机构">
          <el-select v-model="form.district_id" class="filter-item">
            <el-option
              v-for="item in queryOptions.districtOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="form.sex"></el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="职务">
          <el-input v-model="form.job"></el-input>
        </el-form-item>
        <el-form-item label="技能等级">
          <el-input v-model="form.skill_rank"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="属性">
          <el-input v-model="form.property"></el-input>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="addEmployee">立即创建</el-button>
          <el-button @click="addEmployeeDialogVisible = false">取消</el-button>
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
      addEmployeeDialogVisible: false,
      listLoading: false,
      labInfo: [
        {
          name: "丁枫",
          sex: "女",
          number: "F9876543216",
          job: "检测员",
          skill_rank: "Level-1",
          type: "B级检测人员",
          property: "材料",
          createtime: "2022-01-14 15:49:45",
        },
        {
          name: "宋体健",
          sex: "男",
          number: "F9876543213",
          job: "检测员",
          skill_rank: "Level-1",
          type: "A级检测人员",
          property: "材料",
          createtime: "2022-01-14 15:49:40",
        },
        {
          name: "邓平台",
          sex: "男",
          number: "F9876543215",
          job: "副主任",
          skill_rank: "Level-5",
          type: "B级检测人员",
          property: "设备",
          createtime: "2022-01-14 15:49:33",
        },
        {
          name: "周琴",
          sex: "女",
          number: "F9876543212",
          job: "检测员",
          skill_rank: "Level-1",
          type: "A级检测人员",
          property: "设备",
          createtime: "2022-01-14 15:49:23",
        },
      ],
      listQuery: {
        name: "",
        number: "",
        type: "",
        skill_rank: "",
      },
      queryOptions: {
       qtype: [
          "检测员",
          "主任",
          "副主任",
          
        ],
        qskill_rank: [
          "Level-1", 
          "Level-2",
          "Level-3",
          "Level-4",
          "Level-5",
          ],
      },
      form: {
        name: "邓平安",
        sex: "男",
        number: "F9876543215",
        job: "副主任",
        skill_rank: "Level-5",
        type: "B级检测人员",
        property: "设备",
        createtime: "2022-01-14 15:49:23",
      },
    };
  },
  methods: {
    addEmployee() {
      this.form.createtime = new Date().toISOString();
      let obj = { ...this.form };
      this.labInfo.push(obj);
      this.addEmployeeDialogVisible = false;

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
        if (number && item.number.indexOf(number) < 0) return false;
        if (type && item.type !== type) return false;
        if (skill_rank && item.skill_rank !== skill_rank) return false;
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
