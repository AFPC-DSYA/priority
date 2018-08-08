<template>
    <nav class="navbar navbar-expand-lg navbar-dark primary-color-dark fixed-top">
      <router-link class="white-text" to="/"><img src="../../static/afpc_log.png" height="30px"></router-link>
      <div class="navbar-brand white-text"><router-link class="white-text" to="/">Priority Units</router-link></div>
      <button class="navbar-toggler hoverable" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav mr-auto">
          <router-link class="nav-item" to="/" tag="li" active-class="active" exact><a class="nav-link">Units</a></router-link>
          <router-link class="nav-item" to="/afsc" tag="li" active-class="active"><a class="nav-link">AFSC</a></router-link>
          <router-link class="nav-item" to="/history" tag="li" active-class="active"><a class="nav-link">History</a></router-link>
        </ul>
      </div>
    </nav>
</template>

<script>
    
</script>

<style scoped>
    .elevate-3 {
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0px 6px 6px rgba(0,0,0,0.23);
    }

    button:hover {
        background-color: #4285F4;
    }
    button:active {
        background-color: #0d47a1;
    }
</style>
