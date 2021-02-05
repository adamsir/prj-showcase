<template>
  <component is="div" class="todo-atomize">
    <div class="card payment-info background-art">
      <div class="columns">
        <div class="column col-8">
          <address  >
            <div  ><strong  >SomeCompany s.r.o.</strong></div>
            <div  >Kundratka 2359/17a</div>
            <div  >180 00 Prague 8</div>
            <div  >Czech Republic</div>
            <div  >Company ID: 02440032</div>
            <div  >+420 774 555 756</div>
            <div  ><a href="https://Project.io/support/" title="Contact Us"
                target="_blank" class="link-dimmed">support@SomeCompany.com</a></div>
          </address>
        </div>
      </div>
      <div class="columns">
        <div class="column col-8">
          <div class="payment-info-items">
            <div class="card-icon dogs"></div>
            <div class="card-icon btc"></div>
          </div>
          <div class="learn-more-button"><a href="/faq" title="Visit our FAQ">Learn
              more</a></div>
        </div>
      </div>
    </div>
  </component>
</template>

<style lang="scss" scoped>
  .payment-info {
    position: relative;
    display: flex;
    justify-content: space-between;
    top: 0;
    z-index: 0;
    padding: 1.2rem 1.2rem 3rem 1.2rem;
    margin-top: 1.2rem;
    font-size: 0.6rem;
    text-shadow: 0px 1px 0 #fff;

    .learn-more-button {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50%;
      margin: 1.2rem;
    }

    address {
      margin-bottom: 1rem;
      background: #fff;
    }

    &:hover {
      box-shadow: none;
    }

    a {
      font-size: 11px;
      
    }

    .title {
      padding: 0.5rem 0;
      font-size: .8rem;
      font-weight: 500;
    }

    &-items {
      display: flex;
      align-items: center;
      position: relative;
      top: 1px;

      .text {
        margin-right: 1.2rem;
      }

      .card-icon + .card-icon{
        margin-left: 0.2rem;
      }

      .card-icon {
        height: 17px;
      }

      .card-icon.btc {
        min-width: 65px;
        height: 14px;
      }
    }
  }
</style>
