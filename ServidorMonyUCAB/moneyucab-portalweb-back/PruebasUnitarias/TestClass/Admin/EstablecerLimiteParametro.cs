﻿using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace PruebasUnitarias.TestClass.Admin
{
    [TestClass]
    public class EstablecerLimiteParametro
    {
        [TestInitialize]
        public void TestInitialize()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
        }

        [TestMethod]
        public void establecerLimiteParametro()
        {
            Task<HttpResponseMessage> res = APITest.EstablecerLimiteParametro(new {idParametro = 1,limite = ""});
            var status = res.Result.StatusCode;
            Assert.IsTrue(status == HttpStatusCode.OK);
        }

        [TestMethod]
        public void establecerLimiteParametro_invalidoParametroNoRegistrado()
        {
            Task<HttpResponseMessage> res = APITest.EstablecerLimiteParametro(new { idParametro = 404, limite = "" });
            var status = res.Result.StatusCode;
            Assert.IsTrue(status == HttpStatusCode.BadRequest);
        }

        [TestMethod]
        public void establecerLimiteParametro_ParametroInvalido()
        {
            Task<HttpResponseMessage> res = APITest.EstablecerLimiteParametro(new { idParametro = -1, limite = "" });
            var status = res.Result.StatusCode;
            Assert.IsTrue(status == HttpStatusCode.BadRequest);
        }
    }
}