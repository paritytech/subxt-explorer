#[subxt::subxt(runtime_metadata_path = "polkadot.scale")]
pub mod runtime {}
use runtime::runtime_types;
use subxt::{OnlineClient, PolkadotConfig};
use subxt_signer::sr25519::dev;
pub fn main() {}
async fn wrapper() -> Result<(), Box<dyn std::error::Error>> {
    let remark: Vec<u8> = vec![8, 8, 8];
    let payload = runtime::tx().system().remark(remark);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let pages: u64 = 64;
    let payload = runtime::tx().system().set_heap_pages(pages);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let code: Vec<u8> = vec![8, 8, 8];
    let payload = runtime::tx().system().set_code(code);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let code: Vec<u8> = vec![8, 8, 8];
    let payload = runtime::tx().system().set_code_without_checks(code);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let items: Vec<(Vec<u8>, Vec<u8>)> = vec![
        (vec![8, 8, 8], vec![8, 8, 8]), (vec![8, 8, 8], vec![8, 8, 8]), (vec![8, 8, 8],
        vec![8, 8, 8])
    ];
    let payload = runtime::tx().system().set_storage(items);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let keys: Vec<Vec<u8>> = vec![vec![8, 8, 8], vec![8, 8, 8], vec![8, 8, 8]];
    let payload = runtime::tx().system().kill_storage(keys);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let prefix: Vec<u8> = vec![8, 8, 8];
    let subkeys: u32 = 32;
    let payload = runtime::tx().system().kill_prefix(prefix, subkeys);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let remark: Vec<u8> = vec![8, 8, 8];
    let payload = runtime::tx().system().remark_with_event(remark);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let now: u64 = 64;
    let payload = runtime::tx().timestamp().set(now);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let dest: subxt::utils::MultiAddress<subxt::utils::AccountId32, ()> = subxt::utils::MultiAddress::Id(
        dev::bob().public_key().into(),
    );
    let value: u128 = 128;
    let payload = runtime::tx().balances().transfer_allow_death(dest, value);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let who: subxt::utils::MultiAddress<subxt::utils::AccountId32, ()> = subxt::utils::MultiAddress::Id(
        dev::bob().public_key().into(),
    );
    let new_free: u128 = 128;
    let old_reserved: u128 = 128;
    let payload = runtime::tx()
        .balances()
        .set_balance_deprecated(who, new_free, old_reserved);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let source: subxt::utils::MultiAddress<subxt::utils::AccountId32, ()> = subxt::utils::MultiAddress::Id(
        dev::bob().public_key().into(),
    );
    let dest: subxt::utils::MultiAddress<subxt::utils::AccountId32, ()> = subxt::utils::MultiAddress::Id(
        dev::bob().public_key().into(),
    );
    let value: u128 = 128;
    let payload = runtime::tx().balances().force_transfer(source, dest, value);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let dest: subxt::utils::MultiAddress<subxt::utils::AccountId32, ()> = subxt::utils::MultiAddress::Id(
        dev::bob().public_key().into(),
    );
    let value: u128 = 128;
    let payload = runtime::tx().balances().transfer_keep_alive(dest, value);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let dest: subxt::utils::MultiAddress<subxt::utils::AccountId32, ()> = subxt::utils::MultiAddress::Id(
        dev::bob().public_key().into(),
    );
    let keep_alive: bool = false;
    let payload = runtime::tx().balances().transfer_all(dest, keep_alive);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let who: subxt::utils::MultiAddress<subxt::utils::AccountId32, ()> = subxt::utils::MultiAddress::Id(
        dev::bob().public_key().into(),
    );
    let amount: u128 = 128;
    let payload = runtime::tx().balances().force_unreserve(who, amount);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let who: Vec<subxt::utils::AccountId32> = vec![
        dev::bob().public_key().into(), dev::bob().public_key().into(), dev::bob()
        .public_key().into()
    ];
    let payload = runtime::tx().balances().upgrade_accounts(who);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let dest: subxt::utils::MultiAddress<subxt::utils::AccountId32, ()> = subxt::utils::MultiAddress::Id(
        dev::bob().public_key().into(),
    );
    let value: u128 = 128;
    let payload = runtime::tx().balances().transfer(dest, value);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let who: subxt::utils::MultiAddress<subxt::utils::AccountId32, ()> = subxt::utils::MultiAddress::Id(
        dev::bob().public_key().into(),
    );
    let new_free: u128 = 128;
    let payload = runtime::tx().balances().force_set_balance(who, new_free);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let value: u128 = 128;
    let payee: runtime_types::pallet_staking::RewardDestination<
        subxt::utils::AccountId32,
    > = runtime_types::pallet_staking::RewardDestination::Staked;
    let payload = runtime::tx().staking().bond(value, payee);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let max_additional: u128 = 128;
    let payload = runtime::tx().staking().bond_extra(max_additional);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let value: u128 = 128;
    let payload = runtime::tx().staking().unbond(value);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let num_slashing_spans: u32 = 32;
    let payload = runtime::tx().staking().withdraw_unbonded(num_slashing_spans);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let prefs: runtime_types::pallet_staking::ValidatorPrefs = runtime_types::pallet_staking::ValidatorPrefs {
        commission: runtime_types::sp_arithmetic::per_things::Perbill(32),
        blocked: false,
    };
    let payload = runtime::tx().staking().validate(prefs);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let targets: Vec<subxt::utils::MultiAddress<subxt::utils::AccountId32, ()>> = vec![
        subxt::utils::MultiAddress::Id(dev::bob().public_key().into(),),
        subxt::utils::MultiAddress::Id(dev::bob().public_key().into(),),
        subxt::utils::MultiAddress::Id(dev::bob().public_key().into(),)
    ];
    let payload = runtime::tx().staking().nominate(targets);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let payload = runtime::tx().staking().chill();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let payee: runtime_types::pallet_staking::RewardDestination<
        subxt::utils::AccountId32,
    > = runtime_types::pallet_staking::RewardDestination::Staked;
    let payload = runtime::tx().staking().set_payee(payee);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let payload = runtime::tx().staking().set_controller();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let new: u32 = 32;
    let payload = runtime::tx().staking().set_validator_count(new);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let additional: u32 = 32;
    let payload = runtime::tx().staking().increase_validator_count(additional);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let factor: runtime_types::sp_arithmetic::per_things::Percent = runtime_types::sp_arithmetic::per_things::Percent(
        8,
    );
    let payload = runtime::tx().staking().scale_validator_count(factor);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let payload = runtime::tx().staking().force_no_eras();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let payload = runtime::tx().staking().force_new_era();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let invulnerables: Vec<subxt::utils::AccountId32> = vec![
        dev::bob().public_key().into(), dev::bob().public_key().into(), dev::bob()
        .public_key().into()
    ];
    let payload = runtime::tx().staking().set_invulnerables(invulnerables);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let stash: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let num_slashing_spans: u32 = 32;
    let payload = runtime::tx().staking().force_unstake(stash, num_slashing_spans);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let payload = runtime::tx().staking().force_new_era_always();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let era: u32 = 32;
    let slash_indices: Vec<u32> = vec![32, 32, 32];
    let payload = runtime::tx().staking().cancel_deferred_slash(era, slash_indices);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let validator_stash: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let era: u32 = 32;
    let payload = runtime::tx().staking().payout_stakers(validator_stash, era);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let value: u128 = 128;
    let payload = runtime::tx().staking().rebond(value);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let stash: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let num_slashing_spans: u32 = 32;
    let payload = runtime::tx().staking().reap_stash(stash, num_slashing_spans);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let who: Vec<subxt::utils::MultiAddress<subxt::utils::AccountId32, ()>> = vec![
        subxt::utils::MultiAddress::Id(dev::bob().public_key().into(),),
        subxt::utils::MultiAddress::Id(dev::bob().public_key().into(),),
        subxt::utils::MultiAddress::Id(dev::bob().public_key().into(),)
    ];
    let payload = runtime::tx().staking().kick(who);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let min_nominator_bond: runtime_types::pallet_staking::pallet::pallet::ConfigOp<
        u128,
    > = runtime_types::pallet_staking::pallet::pallet::ConfigOp::Noop;
    let min_validator_bond: runtime_types::pallet_staking::pallet::pallet::ConfigOp<
        u128,
    > = runtime_types::pallet_staking::pallet::pallet::ConfigOp::Noop;
    let max_nominator_count: runtime_types::pallet_staking::pallet::pallet::ConfigOp<
        u32,
    > = runtime_types::pallet_staking::pallet::pallet::ConfigOp::Noop;
    let max_validator_count: runtime_types::pallet_staking::pallet::pallet::ConfigOp<
        u32,
    > = runtime_types::pallet_staking::pallet::pallet::ConfigOp::Noop;
    let chill_threshold: runtime_types::pallet_staking::pallet::pallet::ConfigOp<
        runtime_types::sp_arithmetic::per_things::Percent,
    > = runtime_types::pallet_staking::pallet::pallet::ConfigOp::Noop;
    let min_commission: runtime_types::pallet_staking::pallet::pallet::ConfigOp<
        runtime_types::sp_arithmetic::per_things::Perbill,
    > = runtime_types::pallet_staking::pallet::pallet::ConfigOp::Noop;
    let payload = runtime::tx()
        .staking()
        .set_staking_configs(
            min_nominator_bond,
            min_validator_bond,
            max_nominator_count,
            max_validator_count,
            chill_threshold,
            min_commission,
        );
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let controller: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let payload = runtime::tx().staking().chill_other(controller);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let validator_stash: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let payload = runtime::tx().staking().force_apply_min_commission(validator_stash);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let new: runtime_types::sp_arithmetic::per_things::Perbill = runtime_types::sp_arithmetic::per_things::Perbill(
        32,
    );
    let payload = runtime::tx().staking().set_min_commission(new);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let other_signatories: Vec<subxt::utils::AccountId32> = vec![
        dev::bob().public_key().into(), dev::bob().public_key().into(), dev::bob()
        .public_key().into()
    ];
    let call: bool = false;
    let payload = runtime::tx().multisig().as_multi_threshold_1(other_signatories, call);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let threshold: u16 = 16;
    let other_signatories: Vec<subxt::utils::AccountId32> = vec![
        dev::bob().public_key().into(), dev::bob().public_key().into(), dev::bob()
        .public_key().into()
    ];
    let maybe_timepoint: Option<runtime_types::pallet_multisig::Timepoint<u32>> = None;
    let call: bool = false;
    let max_weight: runtime_types::sp_weights::weight_v2::Weight = runtime_types::sp_weights::weight_v2::Weight {
        ref_time: 64,
        proof_size: 64,
    };
    let payload = runtime::tx()
        .multisig()
        .as_multi(threshold, other_signatories, maybe_timepoint, call, max_weight);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let threshold: u16 = 16;
    let other_signatories: Vec<subxt::utils::AccountId32> = vec![
        dev::bob().public_key().into(), dev::bob().public_key().into(), dev::bob()
        .public_key().into()
    ];
    let maybe_timepoint: Option<runtime_types::pallet_multisig::Timepoint<u32>> = None;
    let call_hash: [u8; 32usize] = [8; 32usize];
    let max_weight: runtime_types::sp_weights::weight_v2::Weight = runtime_types::sp_weights::weight_v2::Weight {
        ref_time: 64,
        proof_size: 64,
    };
    let payload = runtime::tx()
        .multisig()
        .approve_as_multi(
            threshold,
            other_signatories,
            maybe_timepoint,
            call_hash,
            max_weight,
        );
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let threshold: u16 = 16;
    let other_signatories: Vec<subxt::utils::AccountId32> = vec![
        dev::bob().public_key().into(), dev::bob().public_key().into(), dev::bob()
        .public_key().into()
    ];
    let timepoint: runtime_types::pallet_multisig::Timepoint<u32> = runtime_types::pallet_multisig::Timepoint {
        height: 32,
        index: 32,
    };
    let call_hash: [u8; 32usize] = [8; 32usize];
    let payload = runtime::tx()
        .multisig()
        .cancel_as_multi(threshold, other_signatories, timepoint, call_hash);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let data: runtime_types::polkadot_primitives::v5::InherentData<
        runtime_types::sp_runtime::generic::header::Header<
            u32,
            runtime_types::sp_runtime::traits::BlakeTwo256,
        >,
    > = runtime_types::polkadot_primitives::v5::InherentData {
        bitfields: vec![
            runtime_types::polkadot_primitives::v5::signed::UncheckedSigned { payload :
            runtime_types::polkadot_primitives::v5::AvailabilityBitfield(subxt::utils::bits::DecodedBits::from_iter([true,
            false, false]),), validator_index :
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,), signature :
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),), __subxt_unused_type_params : ::core::marker::PhantomData },
            runtime_types::polkadot_primitives::v5::signed::UncheckedSigned { payload :
            runtime_types::polkadot_primitives::v5::AvailabilityBitfield(subxt::utils::bits::DecodedBits::from_iter([true,
            false, false]),), validator_index :
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,), signature :
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),), __subxt_unused_type_params : ::core::marker::PhantomData },
            runtime_types::polkadot_primitives::v5::signed::UncheckedSigned { payload :
            runtime_types::polkadot_primitives::v5::AvailabilityBitfield(subxt::utils::bits::DecodedBits::from_iter([true,
            false, false]),), validator_index :
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,), signature :
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),), __subxt_unused_type_params : ::core::marker::PhantomData }
        ],
        backed_candidates: vec![
            runtime_types::polkadot_primitives::v5::BackedCandidate { candidate :
            runtime_types::polkadot_primitives::v5::CommittedCandidateReceipt {
            descriptor : runtime_types::polkadot_primitives::v5::CandidateDescriptor {
            para_id : runtime_types::polkadot_parachain::primitives::Id(32,),
            relay_parent : subxt::utils::H256([8; 32usize],), collator :
            runtime_types::polkadot_primitives::v5::collator_app::Public(runtime_types::sp_core::sr25519::Public([8;
            32usize],),), persisted_validation_data_hash : subxt::utils::H256([8;
            32usize],), pov_hash : subxt::utils::H256([8; 32usize],), erasure_root :
            subxt::utils::H256([8; 32usize],), signature :
            runtime_types::polkadot_primitives::v5::collator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),), para_head : subxt::utils::H256([8; 32usize],),
            validation_code_hash :
            runtime_types::polkadot_parachain::primitives::ValidationCodeHash(subxt::utils::H256([8;
            32usize],),), }, commitments :
            runtime_types::polkadot_primitives::v5::CandidateCommitments {
            upward_messages :
            runtime_types::bounded_collections::bounded_vec::BoundedVec(vec![vec![8, 8,
            8], vec![8, 8, 8], vec![8, 8, 8]],), horizontal_messages :
            runtime_types::bounded_collections::bounded_vec::BoundedVec(vec![runtime_types::polkadot_core_primitives::OutboundHrmpMessage
            { recipient : runtime_types::polkadot_parachain::primitives::Id(32,), data :
            vec![8, 8, 8], },
            runtime_types::polkadot_core_primitives::OutboundHrmpMessage { recipient :
            runtime_types::polkadot_parachain::primitives::Id(32,), data : vec![8, 8, 8],
            }, runtime_types::polkadot_core_primitives::OutboundHrmpMessage { recipient :
            runtime_types::polkadot_parachain::primitives::Id(32,), data : vec![8, 8, 8],
            }],), new_validation_code : None, head_data :
            runtime_types::polkadot_parachain::primitives::HeadData(vec![8, 8, 8],),
            processed_downward_messages : 32, hrmp_watermark : 32, }, }, validity_votes :
            vec![runtime_types::polkadot_primitives::v5::ValidityAttestation::Implicit(runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),),),
            runtime_types::polkadot_primitives::v5::ValidityAttestation::Implicit(runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),),),
            runtime_types::polkadot_primitives::v5::ValidityAttestation::Implicit(runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),),)], validator_indices :
            subxt::utils::bits::DecodedBits::from_iter([true, false, false]), },
            runtime_types::polkadot_primitives::v5::BackedCandidate { candidate :
            runtime_types::polkadot_primitives::v5::CommittedCandidateReceipt {
            descriptor : runtime_types::polkadot_primitives::v5::CandidateDescriptor {
            para_id : runtime_types::polkadot_parachain::primitives::Id(32,),
            relay_parent : subxt::utils::H256([8; 32usize],), collator :
            runtime_types::polkadot_primitives::v5::collator_app::Public(runtime_types::sp_core::sr25519::Public([8;
            32usize],),), persisted_validation_data_hash : subxt::utils::H256([8;
            32usize],), pov_hash : subxt::utils::H256([8; 32usize],), erasure_root :
            subxt::utils::H256([8; 32usize],), signature :
            runtime_types::polkadot_primitives::v5::collator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),), para_head : subxt::utils::H256([8; 32usize],),
            validation_code_hash :
            runtime_types::polkadot_parachain::primitives::ValidationCodeHash(subxt::utils::H256([8;
            32usize],),), }, commitments :
            runtime_types::polkadot_primitives::v5::CandidateCommitments {
            upward_messages :
            runtime_types::bounded_collections::bounded_vec::BoundedVec(vec![vec![8, 8,
            8], vec![8, 8, 8], vec![8, 8, 8]],), horizontal_messages :
            runtime_types::bounded_collections::bounded_vec::BoundedVec(vec![runtime_types::polkadot_core_primitives::OutboundHrmpMessage
            { recipient : runtime_types::polkadot_parachain::primitives::Id(32,), data :
            vec![8, 8, 8], },
            runtime_types::polkadot_core_primitives::OutboundHrmpMessage { recipient :
            runtime_types::polkadot_parachain::primitives::Id(32,), data : vec![8, 8, 8],
            }, runtime_types::polkadot_core_primitives::OutboundHrmpMessage { recipient :
            runtime_types::polkadot_parachain::primitives::Id(32,), data : vec![8, 8, 8],
            }],), new_validation_code : None, head_data :
            runtime_types::polkadot_parachain::primitives::HeadData(vec![8, 8, 8],),
            processed_downward_messages : 32, hrmp_watermark : 32, }, }, validity_votes :
            vec![runtime_types::polkadot_primitives::v5::ValidityAttestation::Implicit(runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),),),
            runtime_types::polkadot_primitives::v5::ValidityAttestation::Implicit(runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),),),
            runtime_types::polkadot_primitives::v5::ValidityAttestation::Implicit(runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),),)], validator_indices :
            subxt::utils::bits::DecodedBits::from_iter([true, false, false]), },
            runtime_types::polkadot_primitives::v5::BackedCandidate { candidate :
            runtime_types::polkadot_primitives::v5::CommittedCandidateReceipt {
            descriptor : runtime_types::polkadot_primitives::v5::CandidateDescriptor {
            para_id : runtime_types::polkadot_parachain::primitives::Id(32,),
            relay_parent : subxt::utils::H256([8; 32usize],), collator :
            runtime_types::polkadot_primitives::v5::collator_app::Public(runtime_types::sp_core::sr25519::Public([8;
            32usize],),), persisted_validation_data_hash : subxt::utils::H256([8;
            32usize],), pov_hash : subxt::utils::H256([8; 32usize],), erasure_root :
            subxt::utils::H256([8; 32usize],), signature :
            runtime_types::polkadot_primitives::v5::collator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),), para_head : subxt::utils::H256([8; 32usize],),
            validation_code_hash :
            runtime_types::polkadot_parachain::primitives::ValidationCodeHash(subxt::utils::H256([8;
            32usize],),), }, commitments :
            runtime_types::polkadot_primitives::v5::CandidateCommitments {
            upward_messages :
            runtime_types::bounded_collections::bounded_vec::BoundedVec(vec![vec![8, 8,
            8], vec![8, 8, 8], vec![8, 8, 8]],), horizontal_messages :
            runtime_types::bounded_collections::bounded_vec::BoundedVec(vec![runtime_types::polkadot_core_primitives::OutboundHrmpMessage
            { recipient : runtime_types::polkadot_parachain::primitives::Id(32,), data :
            vec![8, 8, 8], },
            runtime_types::polkadot_core_primitives::OutboundHrmpMessage { recipient :
            runtime_types::polkadot_parachain::primitives::Id(32,), data : vec![8, 8, 8],
            }, runtime_types::polkadot_core_primitives::OutboundHrmpMessage { recipient :
            runtime_types::polkadot_parachain::primitives::Id(32,), data : vec![8, 8, 8],
            }],), new_validation_code : None, head_data :
            runtime_types::polkadot_parachain::primitives::HeadData(vec![8, 8, 8],),
            processed_downward_messages : 32, hrmp_watermark : 32, }, }, validity_votes :
            vec![runtime_types::polkadot_primitives::v5::ValidityAttestation::Implicit(runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),),),
            runtime_types::polkadot_primitives::v5::ValidityAttestation::Implicit(runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),),),
            runtime_types::polkadot_primitives::v5::ValidityAttestation::Implicit(runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),),)], validator_indices :
            subxt::utils::bits::DecodedBits::from_iter([true, false, false]), }
        ],
        disputes: vec![
            runtime_types::polkadot_primitives::v5::DisputeStatementSet { candidate_hash
            :
            runtime_types::polkadot_core_primitives::CandidateHash(subxt::utils::H256([8;
            32usize],),), session : 32, statements :
            vec![(runtime_types::polkadot_primitives::v5::DisputeStatement::Valid(runtime_types::polkadot_primitives::v5::ValidDisputeStatementKind::Explicit,),
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,),
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),)),
            (runtime_types::polkadot_primitives::v5::DisputeStatement::Valid(runtime_types::polkadot_primitives::v5::ValidDisputeStatementKind::Explicit,),
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,),
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),)),
            (runtime_types::polkadot_primitives::v5::DisputeStatement::Valid(runtime_types::polkadot_primitives::v5::ValidDisputeStatementKind::Explicit,),
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,),
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),))], },
            runtime_types::polkadot_primitives::v5::DisputeStatementSet { candidate_hash
            :
            runtime_types::polkadot_core_primitives::CandidateHash(subxt::utils::H256([8;
            32usize],),), session : 32, statements :
            vec![(runtime_types::polkadot_primitives::v5::DisputeStatement::Valid(runtime_types::polkadot_primitives::v5::ValidDisputeStatementKind::Explicit,),
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,),
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),)),
            (runtime_types::polkadot_primitives::v5::DisputeStatement::Valid(runtime_types::polkadot_primitives::v5::ValidDisputeStatementKind::Explicit,),
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,),
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),)),
            (runtime_types::polkadot_primitives::v5::DisputeStatement::Valid(runtime_types::polkadot_primitives::v5::ValidDisputeStatementKind::Explicit,),
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,),
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),))], },
            runtime_types::polkadot_primitives::v5::DisputeStatementSet { candidate_hash
            :
            runtime_types::polkadot_core_primitives::CandidateHash(subxt::utils::H256([8;
            32usize],),), session : 32, statements :
            vec![(runtime_types::polkadot_primitives::v5::DisputeStatement::Valid(runtime_types::polkadot_primitives::v5::ValidDisputeStatementKind::Explicit,),
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,),
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),)),
            (runtime_types::polkadot_primitives::v5::DisputeStatement::Valid(runtime_types::polkadot_primitives::v5::ValidDisputeStatementKind::Explicit,),
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,),
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),)),
            (runtime_types::polkadot_primitives::v5::DisputeStatement::Valid(runtime_types::polkadot_primitives::v5::ValidDisputeStatementKind::Explicit,),
            runtime_types::polkadot_primitives::v5::ValidatorIndex(32,),
            runtime_types::polkadot_primitives::v5::validator_app::Signature(runtime_types::sp_core::sr25519::Signature([8;
            64usize],),))], }
        ],
        parent_header: runtime_types::sp_runtime::generic::header::Header {
            parent_hash: subxt::utils::H256([8; 32usize]),
            number: 32,
            state_root: subxt::utils::H256([8; 32usize]),
            extrinsics_root: subxt::utils::H256([8; 32usize]),
            digest: runtime_types::sp_runtime::generic::digest::Digest {
                logs: vec![
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],),
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],),
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],)
                ],
            },
            __subxt_unused_type_params: ::core::marker::PhantomData,
        },
    };
    let payload = runtime::tx().para_inherent().enter(data);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().system().account(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::frame_system::AccountInfo<
            u32,
            runtime_types::pallet_balances::types::AccountData<u128>,
        >,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let storage_query = runtime::storage().system().extrinsic_count();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().system().block_weight();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::frame_support::dispatch::PerDispatchClass<
            runtime_types::sp_weights::weight_v2::Weight,
        >,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let storage_query = runtime::storage().system().all_extrinsics_len();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: u32 = 32;
    let storage_query = runtime::storage().system().block_hash(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<subxt::utils::H256> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: u32 = 32;
    let storage_query = runtime::storage().system().extrinsic_data(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<Vec<u8>> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().system().number();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().system().parent_hash();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<subxt::utils::H256> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().system().digest();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::sp_runtime::generic::digest::Digest> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().system().events();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        Vec<
            runtime_types::frame_system::EventRecord<
                runtime_types::polkadot_runtime::RuntimeEvent,
                subxt::utils::H256,
            >,
        >,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let storage_query = runtime::storage().system().event_count();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: subxt::utils::H256 = subxt::utils::H256([8; 32usize]);
    let storage_query = runtime::storage().system().event_topics(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<Vec<(u32, u32)>> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().system().last_runtime_upgrade();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::frame_system::LastRuntimeUpgradeInfo> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().system().upgraded_to_u32_ref_count();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<bool> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().system().upgraded_to_triple_ref_count();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<bool> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().system().execution_phase();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::frame_system::Phase> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().timestamp().now();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u64> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().timestamp().did_update();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<bool> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().balances().total_issuance();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u128> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().balances().inactive_issuance();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u128> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().balances().account(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::pallet_balances::types::AccountData<u128>> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().balances().locks(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::bounded_collections::weak_bounded_vec::WeakBoundedVec<
            runtime_types::pallet_balances::types::BalanceLock<u128>,
        >,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().balances().reserves(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::bounded_collections::bounded_vec::BoundedVec<
            runtime_types::pallet_balances::types::ReserveData<[u8; 8usize], u128>,
        >,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().balances().holds(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::bounded_collections::bounded_vec::BoundedVec<
            runtime_types::pallet_balances::types::IdAmount<
                runtime_types::polkadot_runtime::RuntimeHoldReason,
                u128,
            >,
        >,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().balances().freezes(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::bounded_collections::bounded_vec::BoundedVec<
            runtime_types::pallet_balances::types::IdAmount<(), u128>,
        >,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let storage_query = runtime::storage().staking().validator_count();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().minimum_validator_count();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().invulnerables();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<Vec<subxt::utils::AccountId32>> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().staking().bonded(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<subxt::utils::AccountId32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().min_nominator_bond();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u128> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().min_validator_bond();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u128> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().minimum_active_stake();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u128> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().min_commission();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::sp_arithmetic::per_things::Perbill> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().staking().ledger(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::pallet_staking::StakingLedger> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().staking().payee(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::pallet_staking::RewardDestination<subxt::utils::AccountId32>,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().staking().validators(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::pallet_staking::ValidatorPrefs> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().counter_for_validators();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().max_validators_count();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().staking().nominators(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::pallet_staking::Nominations> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().counter_for_nominators();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().max_nominators_count();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().current_era();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().active_era();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::pallet_staking::ActiveEraInfo> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: u32 = 32;
    let storage_query = runtime::storage().staking().eras_start_session_index(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: u32 = 32;
    let key_1: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().staking().eras_stakers(key_0, key_1);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::pallet_staking::Exposure<subxt::utils::AccountId32, u128>,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let key_0: u32 = 32;
    let key_1: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().staking().eras_stakers_clipped(key_0, key_1);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::pallet_staking::Exposure<subxt::utils::AccountId32, u128>,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let key_0: u32 = 32;
    let key_1: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().staking().eras_validator_prefs(key_0, key_1);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::pallet_staking::ValidatorPrefs> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: u32 = 32;
    let storage_query = runtime::storage().staking().eras_validator_reward(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u128> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: u32 = 32;
    let storage_query = runtime::storage().staking().eras_reward_points(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::pallet_staking::EraRewardPoints<subxt::utils::AccountId32>,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let key_0: u32 = 32;
    let storage_query = runtime::storage().staking().eras_total_stake(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u128> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().force_era();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::pallet_staking::Forcing> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().slash_reward_fraction();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::sp_arithmetic::per_things::Perbill> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().canceled_slash_payout();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u128> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: u32 = 32;
    let storage_query = runtime::storage().staking().unapplied_slashes(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        Vec<
            runtime_types::pallet_staking::UnappliedSlash<
                subxt::utils::AccountId32,
                u128,
            >,
        >,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let storage_query = runtime::storage().staking().bonded_eras();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<Vec<(u32, u32)>> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: u32 = 32;
    let key_1: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage()
        .staking()
        .validator_slash_in_era(key_0, key_1);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<(runtime_types::sp_arithmetic::per_things::Perbill, u128)> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: u32 = 32;
    let key_1: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage()
        .staking()
        .nominator_slash_in_era(key_0, key_1);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u128> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let storage_query = runtime::storage().staking().slashing_spans(key_0);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::pallet_staking::slashing::SlashingSpans> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let key_1: u32 = 32;
    let storage_query = runtime::storage().staking().span_slash(key_0, key_1);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::pallet_staking::slashing::SpanRecord<u128>> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().current_planned_session();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().offending_validators();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<Vec<(u32, bool)>> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().staking().chill_threshold();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::sp_arithmetic::per_things::Percent> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let key_0: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let key_1: [u8; 32usize] = [8; 32usize];
    let storage_query = runtime::storage().multisig().multisigs(key_0, key_1);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::pallet_multisig::Multisig<u32, u128, subxt::utils::AccountId32>,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let storage_query = runtime::storage().para_inherent().included();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<()> = api
        .storage()
        .at_latest()
        .await?
        .fetch(&storage_query)
        .await?;
    let storage_query = runtime::storage().para_inherent().on_chain_votes();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::polkadot_primitives::v5::ScrapedOnChainVotes<subxt::utils::H256>,
    > = api.storage().at_latest().await?.fetch(&storage_query).await?;
    let constant_query = runtime::constants().system().block_weights();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: runtime_types::frame_system::limits::BlockWeights = api
        .constants()
        .at(&constant_query)?;
    let constant_query = runtime::constants().system().block_length();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: runtime_types::frame_system::limits::BlockLength = api
        .constants()
        .at(&constant_query)?;
    let constant_query = runtime::constants().system().block_hash_count();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().system().db_weight();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: runtime_types::sp_weights::RuntimeDbWeight = api
        .constants()
        .at(&constant_query)?;
    let constant_query = runtime::constants().system().version();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: runtime_types::sp_version::RuntimeVersion = api
        .constants()
        .at(&constant_query)?;
    let constant_query = runtime::constants().system().ss58_prefix();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u16 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().timestamp().minimum_period();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u64 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().balances().existential_deposit();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u128 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().balances().max_locks();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().balances().max_reserves();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().balances().max_holds();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().balances().max_freezes();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().staking().max_nominations();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().staking().history_depth();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().staking().sessions_per_era();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().staking().bonding_duration();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().staking().slash_defer_duration();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants()
        .staking()
        .max_nominator_rewarded_per_validator();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().staking().max_unlocking_chunks();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().multisig().deposit_base();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u128 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().multisig().deposit_factor();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u128 = api.constants().at(&constant_query)?;
    let constant_query = runtime::constants().multisig().max_signatories();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let value: u32 = api.constants().at(&constant_query)?;
    let runtime_api_call = runtime::apis().core().version();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::sp_version::RuntimeVersion = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let block: runtime_types::sp_runtime::generic::block::Block<
        runtime_types::sp_runtime::generic::header::Header<
            u32,
            runtime_types::sp_runtime::traits::BlakeTwo256,
        >,
        subxt::utils::UncheckedExtrinsic<
            subxt::utils::MultiAddress<subxt::utils::AccountId32, ()>,
            runtime_types::polkadot_runtime::RuntimeCall,
            runtime_types::sp_runtime::MultiSignature,
            (
                runtime_types::frame_system::extensions::check_non_zero_sender::CheckNonZeroSender,
                runtime_types::frame_system::extensions::check_spec_version::CheckSpecVersion,
                runtime_types::frame_system::extensions::check_tx_version::CheckTxVersion,
                runtime_types::frame_system::extensions::check_genesis::CheckGenesis,
                runtime_types::frame_system::extensions::check_mortality::CheckMortality,
                runtime_types::frame_system::extensions::check_nonce::CheckNonce,
                runtime_types::frame_system::extensions::check_weight::CheckWeight,
                runtime_types::pallet_transaction_payment::ChargeTransactionPayment,
                runtime_types::polkadot_runtime_common::claims::PrevalidateAttests,
            ),
        >,
    > = runtime_types::sp_runtime::generic::block::Block {
        header: runtime_types::sp_runtime::generic::header::Header {
            parent_hash: subxt::utils::H256([8; 32usize]),
            number: 32,
            state_root: subxt::utils::H256([8; 32usize]),
            extrinsics_root: subxt::utils::H256([8; 32usize]),
            digest: runtime_types::sp_runtime::generic::digest::Digest {
                logs: vec![
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],),
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],),
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],)
                ],
            },
            __subxt_unused_type_params: ::core::marker::PhantomData,
        },
        extrinsics: vec![
            subxt::utils::UncheckedExtrinsic::new(vec![1, 2, 3, 4]),
            subxt::utils::UncheckedExtrinsic::new(vec![1, 2, 3, 4]),
            subxt::utils::UncheckedExtrinsic::new(vec![1, 2, 3, 4])
        ],
    };
    let runtime_api_call = runtime::apis().core().execute_block(block);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: () = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let header: runtime_types::sp_runtime::generic::header::Header<
        u32,
        runtime_types::sp_runtime::traits::BlakeTwo256,
    > = runtime_types::sp_runtime::generic::header::Header {
        parent_hash: subxt::utils::H256([8; 32usize]),
        number: 32,
        state_root: subxt::utils::H256([8; 32usize]),
        extrinsics_root: subxt::utils::H256([8; 32usize]),
        digest: runtime_types::sp_runtime::generic::digest::Digest {
            logs: vec![
                runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                4usize], vec![8, 8, 8],),
                runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                4usize], vec![8, 8, 8],),
                runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                4usize], vec![8, 8, 8],)
            ],
        },
        __subxt_unused_type_params: ::core::marker::PhantomData,
    };
    let runtime_api_call = runtime::apis().core().initialize_block(header);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: () = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let runtime_api_call = runtime::apis().metadata().metadata();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::sp_core::OpaqueMetadata = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let version: u32 = 32;
    let runtime_api_call = runtime::apis().metadata().metadata_at_version(version);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::sp_core::OpaqueMetadata> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().metadata().metadata_versions();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<u32> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let extrinsic: subxt::utils::UncheckedExtrinsic<
        subxt::utils::MultiAddress<subxt::utils::AccountId32, ()>,
        runtime_types::polkadot_runtime::RuntimeCall,
        runtime_types::sp_runtime::MultiSignature,
        (
            runtime_types::frame_system::extensions::check_non_zero_sender::CheckNonZeroSender,
            runtime_types::frame_system::extensions::check_spec_version::CheckSpecVersion,
            runtime_types::frame_system::extensions::check_tx_version::CheckTxVersion,
            runtime_types::frame_system::extensions::check_genesis::CheckGenesis,
            runtime_types::frame_system::extensions::check_mortality::CheckMortality,
            runtime_types::frame_system::extensions::check_nonce::CheckNonce,
            runtime_types::frame_system::extensions::check_weight::CheckWeight,
            runtime_types::pallet_transaction_payment::ChargeTransactionPayment,
            runtime_types::polkadot_runtime_common::claims::PrevalidateAttests,
        ),
    > = subxt::utils::UncheckedExtrinsic::new(vec![1, 2, 3, 4]);
    let runtime_api_call = runtime::apis().block_builder().apply_extrinsic(extrinsic);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: ::core::result::Result<
        ::core::result::Result<(), runtime_types::sp_runtime::DispatchError>,
        runtime_types::sp_runtime::transaction_validity::TransactionValidityError,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let runtime_api_call = runtime::apis().block_builder().finalize_block();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::sp_runtime::generic::header::Header<
        u32,
        runtime_types::sp_runtime::traits::BlakeTwo256,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let inherent: runtime_types::sp_inherents::InherentData = runtime_types::sp_inherents::InherentData {
        data: vec![([8; 8usize], vec![8, 8, 8])],
    };
    let runtime_api_call = runtime::apis().block_builder().inherent_extrinsics(inherent);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<
        subxt::utils::UncheckedExtrinsic<
            subxt::utils::MultiAddress<subxt::utils::AccountId32, ()>,
            runtime_types::polkadot_runtime::RuntimeCall,
            runtime_types::sp_runtime::MultiSignature,
            (
                runtime_types::frame_system::extensions::check_non_zero_sender::CheckNonZeroSender,
                runtime_types::frame_system::extensions::check_spec_version::CheckSpecVersion,
                runtime_types::frame_system::extensions::check_tx_version::CheckTxVersion,
                runtime_types::frame_system::extensions::check_genesis::CheckGenesis,
                runtime_types::frame_system::extensions::check_mortality::CheckMortality,
                runtime_types::frame_system::extensions::check_nonce::CheckNonce,
                runtime_types::frame_system::extensions::check_weight::CheckWeight,
                runtime_types::pallet_transaction_payment::ChargeTransactionPayment,
                runtime_types::polkadot_runtime_common::claims::PrevalidateAttests,
            ),
        >,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let block: runtime_types::sp_runtime::generic::block::Block<
        runtime_types::sp_runtime::generic::header::Header<
            u32,
            runtime_types::sp_runtime::traits::BlakeTwo256,
        >,
        subxt::utils::UncheckedExtrinsic<
            subxt::utils::MultiAddress<subxt::utils::AccountId32, ()>,
            runtime_types::polkadot_runtime::RuntimeCall,
            runtime_types::sp_runtime::MultiSignature,
            (
                runtime_types::frame_system::extensions::check_non_zero_sender::CheckNonZeroSender,
                runtime_types::frame_system::extensions::check_spec_version::CheckSpecVersion,
                runtime_types::frame_system::extensions::check_tx_version::CheckTxVersion,
                runtime_types::frame_system::extensions::check_genesis::CheckGenesis,
                runtime_types::frame_system::extensions::check_mortality::CheckMortality,
                runtime_types::frame_system::extensions::check_nonce::CheckNonce,
                runtime_types::frame_system::extensions::check_weight::CheckWeight,
                runtime_types::pallet_transaction_payment::ChargeTransactionPayment,
                runtime_types::polkadot_runtime_common::claims::PrevalidateAttests,
            ),
        >,
    > = runtime_types::sp_runtime::generic::block::Block {
        header: runtime_types::sp_runtime::generic::header::Header {
            parent_hash: subxt::utils::H256([8; 32usize]),
            number: 32,
            state_root: subxt::utils::H256([8; 32usize]),
            extrinsics_root: subxt::utils::H256([8; 32usize]),
            digest: runtime_types::sp_runtime::generic::digest::Digest {
                logs: vec![
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],),
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],),
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],)
                ],
            },
            __subxt_unused_type_params: ::core::marker::PhantomData,
        },
        extrinsics: vec![
            subxt::utils::UncheckedExtrinsic::new(vec![1, 2, 3, 4]),
            subxt::utils::UncheckedExtrinsic::new(vec![1, 2, 3, 4]),
            subxt::utils::UncheckedExtrinsic::new(vec![1, 2, 3, 4])
        ],
    };
    let data: runtime_types::sp_inherents::InherentData = runtime_types::sp_inherents::InherentData {
        data: vec![([8; 8usize], vec![8, 8, 8])],
    };
    let runtime_api_call = runtime::apis().block_builder().check_inherents(block, data);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::sp_inherents::CheckInherentsResult = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let who: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let runtime_api_call = runtime::apis().nomination_pools_api().pending_rewards(who);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: u128 = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let pool_id: u32 = 32;
    let points: u128 = 128;
    let runtime_api_call = runtime::apis()
        .nomination_pools_api()
        .points_to_balance(pool_id, points);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: u128 = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let pool_id: u32 = 32;
    let new_funds: u128 = 128;
    let runtime_api_call = runtime::apis()
        .nomination_pools_api()
        .balance_to_points(pool_id, new_funds);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: u128 = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let balance: u128 = 128;
    let runtime_api_call = runtime::apis().staking_api().nominations_quota(balance);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: u32 = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let source: runtime_types::sp_runtime::transaction_validity::TransactionSource = runtime_types::sp_runtime::transaction_validity::TransactionSource::InBlock;
    let tx: subxt::utils::UncheckedExtrinsic<
        subxt::utils::MultiAddress<subxt::utils::AccountId32, ()>,
        runtime_types::polkadot_runtime::RuntimeCall,
        runtime_types::sp_runtime::MultiSignature,
        (
            runtime_types::frame_system::extensions::check_non_zero_sender::CheckNonZeroSender,
            runtime_types::frame_system::extensions::check_spec_version::CheckSpecVersion,
            runtime_types::frame_system::extensions::check_tx_version::CheckTxVersion,
            runtime_types::frame_system::extensions::check_genesis::CheckGenesis,
            runtime_types::frame_system::extensions::check_mortality::CheckMortality,
            runtime_types::frame_system::extensions::check_nonce::CheckNonce,
            runtime_types::frame_system::extensions::check_weight::CheckWeight,
            runtime_types::pallet_transaction_payment::ChargeTransactionPayment,
            runtime_types::polkadot_runtime_common::claims::PrevalidateAttests,
        ),
    > = subxt::utils::UncheckedExtrinsic::new(vec![1, 2, 3, 4]);
    let block_hash: subxt::utils::H256 = subxt::utils::H256([8; 32usize]);
    let runtime_api_call = runtime::apis()
        .tagged_transaction_queue()
        .validate_transaction(source, tx, block_hash);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: ::core::result::Result<
        runtime_types::sp_runtime::transaction_validity::ValidTransaction,
        runtime_types::sp_runtime::transaction_validity::TransactionValidityError,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let header: runtime_types::sp_runtime::generic::header::Header<
        u32,
        runtime_types::sp_runtime::traits::BlakeTwo256,
    > = runtime_types::sp_runtime::generic::header::Header {
        parent_hash: subxt::utils::H256([8; 32usize]),
        number: 32,
        state_root: subxt::utils::H256([8; 32usize]),
        extrinsics_root: subxt::utils::H256([8; 32usize]),
        digest: runtime_types::sp_runtime::generic::digest::Digest {
            logs: vec![
                runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                4usize], vec![8, 8, 8],),
                runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                4usize], vec![8, 8, 8],),
                runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                4usize], vec![8, 8, 8],)
            ],
        },
        __subxt_unused_type_params: ::core::marker::PhantomData,
    };
    let runtime_api_call = runtime::apis().offchain_worker_api().offchain_worker(header);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: () = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let runtime_api_call = runtime::apis().parachain_host().validators();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<runtime_types::polkadot_primitives::v5::validator_app::Public> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().parachain_host().validator_groups();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: (
        Vec<Vec<runtime_types::polkadot_primitives::v5::ValidatorIndex>>,
        runtime_types::polkadot_primitives::v5::GroupRotationInfo<u32>,
    ) = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let runtime_api_call = runtime::apis().parachain_host().availability_cores();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<
        runtime_types::polkadot_primitives::v5::CoreState<subxt::utils::H256, u32>,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let para_id: runtime_types::polkadot_parachain::primitives::Id = runtime_types::polkadot_parachain::primitives::Id(
        32,
    );
    let assumption: runtime_types::polkadot_primitives::v5::OccupiedCoreAssumption = runtime_types::polkadot_primitives::v5::OccupiedCoreAssumption::Included;
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .persisted_validation_data(para_id, assumption);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::polkadot_primitives::v5::PersistedValidationData<
            subxt::utils::H256,
            u32,
        >,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let para_id: runtime_types::polkadot_parachain::primitives::Id = runtime_types::polkadot_parachain::primitives::Id(
        32,
    );
    let expected_persisted_validation_data_hash: subxt::utils::H256 = subxt::utils::H256(
        [8; 32usize],
    );
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .assumed_validation_data(para_id, expected_persisted_validation_data_hash);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        (
            runtime_types::polkadot_primitives::v5::PersistedValidationData<
                subxt::utils::H256,
                u32,
            >,
            runtime_types::polkadot_parachain::primitives::ValidationCodeHash,
        ),
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let para_id: runtime_types::polkadot_parachain::primitives::Id = runtime_types::polkadot_parachain::primitives::Id(
        32,
    );
    let outputs: runtime_types::polkadot_primitives::v5::CandidateCommitments<u32> = runtime_types::polkadot_primitives::v5::CandidateCommitments {
        upward_messages: runtime_types::bounded_collections::bounded_vec::BoundedVec(
            vec![vec![8, 8, 8], vec![8, 8, 8], vec![8, 8, 8]],
        ),
        horizontal_messages: runtime_types::bounded_collections::bounded_vec::BoundedVec(
            vec![
                runtime_types::polkadot_core_primitives::OutboundHrmpMessage { recipient
                : runtime_types::polkadot_parachain::primitives::Id(32,), data : vec![8,
                8, 8], }, runtime_types::polkadot_core_primitives::OutboundHrmpMessage {
                recipient : runtime_types::polkadot_parachain::primitives::Id(32,), data
                : vec![8, 8, 8], },
                runtime_types::polkadot_core_primitives::OutboundHrmpMessage { recipient
                : runtime_types::polkadot_parachain::primitives::Id(32,), data : vec![8,
                8, 8], }
            ],
        ),
        new_validation_code: None,
        head_data: runtime_types::polkadot_parachain::primitives::HeadData(
            vec![8, 8, 8],
        ),
        processed_downward_messages: 32,
        hrmp_watermark: 32,
    };
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .check_validation_outputs(para_id, outputs);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: bool = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().parachain_host().session_index_for_child();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: u32 = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let para_id: runtime_types::polkadot_parachain::primitives::Id = runtime_types::polkadot_parachain::primitives::Id(
        32,
    );
    let assumption: runtime_types::polkadot_primitives::v5::OccupiedCoreAssumption = runtime_types::polkadot_primitives::v5::OccupiedCoreAssumption::Included;
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .validation_code(para_id, assumption);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::polkadot_parachain::primitives::ValidationCode> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let para_id: runtime_types::polkadot_parachain::primitives::Id = runtime_types::polkadot_parachain::primitives::Id(
        32,
    );
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .candidate_pending_availability(para_id);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::polkadot_primitives::v5::CommittedCandidateReceipt<
            subxt::utils::H256,
        >,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let runtime_api_call = runtime::apis().parachain_host().candidate_events();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<
        runtime_types::polkadot_primitives::v5::CandidateEvent<subxt::utils::H256>,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let recipient: runtime_types::polkadot_parachain::primitives::Id = runtime_types::polkadot_parachain::primitives::Id(
        32,
    );
    let runtime_api_call = runtime::apis().parachain_host().dmq_contents(recipient);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<
        runtime_types::polkadot_core_primitives::InboundDownwardMessage<u32>,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let recipient: runtime_types::polkadot_parachain::primitives::Id = runtime_types::polkadot_parachain::primitives::Id(
        32,
    );
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .inbound_hrmp_channels_contents(recipient);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: subxt::utils::KeyedVec<
        runtime_types::polkadot_parachain::primitives::Id,
        Vec<runtime_types::polkadot_core_primitives::InboundHrmpMessage<u32>>,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let hash: runtime_types::polkadot_parachain::primitives::ValidationCodeHash = runtime_types::polkadot_parachain::primitives::ValidationCodeHash(
        subxt::utils::H256([8; 32usize]),
    );
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .validation_code_by_hash(hash);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::polkadot_parachain::primitives::ValidationCode> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().parachain_host().on_chain_votes();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::polkadot_primitives::v5::ScrapedOnChainVotes<subxt::utils::H256>,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let index: u32 = 32;
    let runtime_api_call = runtime::apis().parachain_host().session_info(index);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::polkadot_primitives::v5::SessionInfo> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let stmt: runtime_types::polkadot_primitives::v5::PvfCheckStatement = runtime_types::polkadot_primitives::v5::PvfCheckStatement {
        accept: false,
        subject: runtime_types::polkadot_parachain::primitives::ValidationCodeHash(
            subxt::utils::H256([8; 32usize]),
        ),
        session_index: 32,
        validator_index: runtime_types::polkadot_primitives::v5::ValidatorIndex(32),
    };
    let signature: runtime_types::polkadot_primitives::v5::validator_app::Signature = runtime_types::polkadot_primitives::v5::validator_app::Signature(
        runtime_types::sp_core::sr25519::Signature([8; 64usize]),
    );
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .submit_pvf_check_statement(stmt, signature);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: () = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let runtime_api_call = runtime::apis().parachain_host().pvfs_require_precheck();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<runtime_types::polkadot_parachain::primitives::ValidationCodeHash> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let para_id: runtime_types::polkadot_parachain::primitives::Id = runtime_types::polkadot_parachain::primitives::Id(
        32,
    );
    let assumption: runtime_types::polkadot_primitives::v5::OccupiedCoreAssumption = runtime_types::polkadot_primitives::v5::OccupiedCoreAssumption::Included;
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .validation_code_hash(para_id, assumption);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::polkadot_parachain::primitives::ValidationCodeHash,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let runtime_api_call = runtime::apis().parachain_host().disputes();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<
        (
            u32,
            runtime_types::polkadot_core_primitives::CandidateHash,
            runtime_types::polkadot_primitives::v5::DisputeState<u32>,
        ),
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let session_index: u32 = 32;
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .session_executor_params(session_index);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::polkadot_primitives::v5::executor_params::ExecutorParams,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let runtime_api_call = runtime::apis().parachain_host().unapplied_slashes();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<
        (
            u32,
            runtime_types::polkadot_core_primitives::CandidateHash,
            runtime_types::polkadot_primitives::v5::slashing::PendingSlashes,
        ),
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let validator_id: runtime_types::polkadot_primitives::v5::validator_app::Public = runtime_types::polkadot_primitives::v5::validator_app::Public(
        runtime_types::sp_core::sr25519::Public([8; 32usize]),
    );
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .key_ownership_proof(validator_id);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::polkadot_primitives::v5::slashing::OpaqueKeyOwnershipProof,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let dispute_proof: runtime_types::polkadot_primitives::v5::slashing::DisputeProof = runtime_types::polkadot_primitives::v5::slashing::DisputeProof {
        time_slot: runtime_types::polkadot_primitives::v5::slashing::DisputesTimeSlot {
            session_index: 32,
            candidate_hash: runtime_types::polkadot_core_primitives::CandidateHash(
                subxt::utils::H256([8; 32usize]),
            ),
        },
        kind: runtime_types::polkadot_primitives::v5::slashing::SlashingOffenceKind::ForInvalid,
        validator_index: runtime_types::polkadot_primitives::v5::ValidatorIndex(32),
        validator_id: runtime_types::polkadot_primitives::v5::validator_app::Public(
            runtime_types::sp_core::sr25519::Public([8; 32usize]),
        ),
    };
    let key_ownership_proof: runtime_types::polkadot_primitives::v5::slashing::OpaqueKeyOwnershipProof = runtime_types::polkadot_primitives::v5::slashing::OpaqueKeyOwnershipProof(
        vec![8, 8, 8],
    );
    let runtime_api_call = runtime::apis()
        .parachain_host()
        .submit_report_dispute_lost(dispute_proof, key_ownership_proof);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<()> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().beefy_api().beefy_genesis();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<u32> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().beefy_api().validator_set();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<
        runtime_types::sp_consensus_beefy::ValidatorSet<
            runtime_types::sp_consensus_beefy::crypto::Public,
        >,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let equivocation_proof: runtime_types::sp_consensus_beefy::EquivocationProof<
        u32,
        runtime_types::sp_consensus_beefy::crypto::Public,
        runtime_types::sp_consensus_beefy::crypto::Signature,
    > = runtime_types::sp_consensus_beefy::EquivocationProof {
        first: runtime_types::sp_consensus_beefy::VoteMessage {
            commitment: runtime_types::sp_consensus_beefy::commitment::Commitment {
                payload: runtime_types::sp_consensus_beefy::payload::Payload(
                    vec![
                        ([8; 2usize], vec![8, 8, 8]), ([8; 2usize], vec![8, 8, 8]), ([8;
                        2usize], vec![8, 8, 8])
                    ],
                ),
                block_number: 32,
                validator_set_id: 64,
            },
            id: runtime_types::sp_consensus_beefy::crypto::Public(
                runtime_types::sp_core::ecdsa::Public([8; 33usize]),
            ),
            signature: runtime_types::sp_consensus_beefy::crypto::Signature(
                runtime_types::sp_core::ecdsa::Signature([8; 65usize]),
            ),
        },
        second: runtime_types::sp_consensus_beefy::VoteMessage {
            commitment: runtime_types::sp_consensus_beefy::commitment::Commitment {
                payload: runtime_types::sp_consensus_beefy::payload::Payload(
                    vec![
                        ([8; 2usize], vec![8, 8, 8]), ([8; 2usize], vec![8, 8, 8]), ([8;
                        2usize], vec![8, 8, 8])
                    ],
                ),
                block_number: 32,
                validator_set_id: 64,
            },
            id: runtime_types::sp_consensus_beefy::crypto::Public(
                runtime_types::sp_core::ecdsa::Public([8; 33usize]),
            ),
            signature: runtime_types::sp_consensus_beefy::crypto::Signature(
                runtime_types::sp_core::ecdsa::Signature([8; 65usize]),
            ),
        },
    };
    let key_owner_proof: runtime_types::sp_consensus_beefy::OpaqueKeyOwnershipProof = runtime_types::sp_consensus_beefy::OpaqueKeyOwnershipProof(
        vec![8, 8, 8],
    );
    let runtime_api_call = runtime::apis()
        .beefy_api()
        .submit_report_equivocation_unsigned_extrinsic(
            equivocation_proof,
            key_owner_proof,
        );
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<()> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let set_id: u64 = 64;
    let authority_id: runtime_types::sp_consensus_beefy::crypto::Public = runtime_types::sp_consensus_beefy::crypto::Public(
        runtime_types::sp_core::ecdsa::Public([8; 33usize]),
    );
    let runtime_api_call = runtime::apis()
        .beefy_api()
        .generate_key_ownership_proof(set_id, authority_id);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::sp_consensus_beefy::OpaqueKeyOwnershipProof> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().mmr_api().mmr_root();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: ::core::result::Result<
        subxt::utils::H256,
        runtime_types::sp_mmr_primitives::Error,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let runtime_api_call = runtime::apis().mmr_api().mmr_leaf_count();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: ::core::result::Result<u64, runtime_types::sp_mmr_primitives::Error> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let block_numbers: Vec<u32> = vec![32, 32, 32];
    let best_known_block_number: Option<u32> = None;
    let runtime_api_call = runtime::apis()
        .mmr_api()
        .generate_proof(block_numbers, best_known_block_number);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: ::core::result::Result<
        (
            Vec<runtime_types::sp_mmr_primitives::EncodableOpaqueLeaf>,
            runtime_types::sp_mmr_primitives::Proof<subxt::utils::H256>,
        ),
        runtime_types::sp_mmr_primitives::Error,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let leaves: Vec<runtime_types::sp_mmr_primitives::EncodableOpaqueLeaf> = vec![
        runtime_types::sp_mmr_primitives::EncodableOpaqueLeaf(vec![8, 8, 8],),
        runtime_types::sp_mmr_primitives::EncodableOpaqueLeaf(vec![8, 8, 8],),
        runtime_types::sp_mmr_primitives::EncodableOpaqueLeaf(vec![8, 8, 8],)
    ];
    let proof: runtime_types::sp_mmr_primitives::Proof<subxt::utils::H256> = runtime_types::sp_mmr_primitives::Proof {
        leaf_indices: vec![64, 64, 64],
        leaf_count: 64,
        items: vec![
            subxt::utils::H256([8; 32usize],), subxt::utils::H256([8; 32usize],),
            subxt::utils::H256([8; 32usize],)
        ],
    };
    let runtime_api_call = runtime::apis().mmr_api().verify_proof(leaves, proof);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: ::core::result::Result<(), runtime_types::sp_mmr_primitives::Error> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let root: subxt::utils::H256 = subxt::utils::H256([8; 32usize]);
    let leaves: Vec<runtime_types::sp_mmr_primitives::EncodableOpaqueLeaf> = vec![
        runtime_types::sp_mmr_primitives::EncodableOpaqueLeaf(vec![8, 8, 8],),
        runtime_types::sp_mmr_primitives::EncodableOpaqueLeaf(vec![8, 8, 8],),
        runtime_types::sp_mmr_primitives::EncodableOpaqueLeaf(vec![8, 8, 8],)
    ];
    let proof: runtime_types::sp_mmr_primitives::Proof<subxt::utils::H256> = runtime_types::sp_mmr_primitives::Proof {
        leaf_indices: vec![64, 64, 64],
        leaf_count: 64,
        items: vec![
            subxt::utils::H256([8; 32usize],), subxt::utils::H256([8; 32usize],),
            subxt::utils::H256([8; 32usize],)
        ],
    };
    let runtime_api_call = runtime::apis()
        .mmr_api()
        .verify_proof_stateless(root, leaves, proof);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: ::core::result::Result<(), runtime_types::sp_mmr_primitives::Error> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().grandpa_api().grandpa_authorities();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<(runtime_types::sp_consensus_grandpa::app::Public, u64)> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let equivocation_proof: runtime_types::sp_consensus_grandpa::EquivocationProof<
        subxt::utils::H256,
        u32,
    > = runtime_types::sp_consensus_grandpa::EquivocationProof {
        set_id: 64,
        equivocation: runtime_types::sp_consensus_grandpa::Equivocation::Prevote(runtime_types::finality_grandpa::Equivocation {
            round_number: 64,
            identity: runtime_types::sp_consensus_grandpa::app::Public(
                runtime_types::sp_core::ed25519::Public([8; 32usize]),
            ),
            first: (
                runtime_types::finality_grandpa::Prevote {
                    target_hash: subxt::utils::H256([8; 32usize]),
                    target_number: 32,
                },
                runtime_types::sp_consensus_grandpa::app::Signature(
                    runtime_types::sp_core::ed25519::Signature([8; 64usize]),
                ),
            ),
            second: (
                runtime_types::finality_grandpa::Prevote {
                    target_hash: subxt::utils::H256([8; 32usize]),
                    target_number: 32,
                },
                runtime_types::sp_consensus_grandpa::app::Signature(
                    runtime_types::sp_core::ed25519::Signature([8; 64usize]),
                ),
            ),
        }),
    };
    let key_owner_proof: runtime_types::sp_consensus_grandpa::OpaqueKeyOwnershipProof = runtime_types::sp_consensus_grandpa::OpaqueKeyOwnershipProof(
        vec![8, 8, 8],
    );
    let runtime_api_call = runtime::apis()
        .grandpa_api()
        .submit_report_equivocation_unsigned_extrinsic(
            equivocation_proof,
            key_owner_proof,
        );
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<()> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let set_id: u64 = 64;
    let authority_id: runtime_types::sp_consensus_grandpa::app::Public = runtime_types::sp_consensus_grandpa::app::Public(
        runtime_types::sp_core::ed25519::Public([8; 32usize]),
    );
    let runtime_api_call = runtime::apis()
        .grandpa_api()
        .generate_key_ownership_proof(set_id, authority_id);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::sp_consensus_grandpa::OpaqueKeyOwnershipProof> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().grandpa_api().current_set_id();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: u64 = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let runtime_api_call = runtime::apis().babe_api().configuration();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::sp_consensus_babe::BabeConfiguration = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().babe_api().current_epoch_start();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::sp_consensus_slots::Slot = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().babe_api().current_epoch();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::sp_consensus_babe::Epoch = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().babe_api().next_epoch();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::sp_consensus_babe::Epoch = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let slot: runtime_types::sp_consensus_slots::Slot = runtime_types::sp_consensus_slots::Slot(
        64,
    );
    let authority_id: runtime_types::sp_consensus_babe::app::Public = runtime_types::sp_consensus_babe::app::Public(
        runtime_types::sp_core::sr25519::Public([8; 32usize]),
    );
    let runtime_api_call = runtime::apis()
        .babe_api()
        .generate_key_ownership_proof(slot, authority_id);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<runtime_types::sp_consensus_babe::OpaqueKeyOwnershipProof> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let equivocation_proof: runtime_types::sp_consensus_slots::EquivocationProof<
        runtime_types::sp_runtime::generic::header::Header<
            u32,
            runtime_types::sp_runtime::traits::BlakeTwo256,
        >,
        runtime_types::sp_consensus_babe::app::Public,
    > = runtime_types::sp_consensus_slots::EquivocationProof {
        offender: runtime_types::sp_consensus_babe::app::Public(
            runtime_types::sp_core::sr25519::Public([8; 32usize]),
        ),
        slot: runtime_types::sp_consensus_slots::Slot(64),
        first_header: runtime_types::sp_runtime::generic::header::Header {
            parent_hash: subxt::utils::H256([8; 32usize]),
            number: 32,
            state_root: subxt::utils::H256([8; 32usize]),
            extrinsics_root: subxt::utils::H256([8; 32usize]),
            digest: runtime_types::sp_runtime::generic::digest::Digest {
                logs: vec![
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],),
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],),
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],)
                ],
            },
            __subxt_unused_type_params: ::core::marker::PhantomData,
        },
        second_header: runtime_types::sp_runtime::generic::header::Header {
            parent_hash: subxt::utils::H256([8; 32usize]),
            number: 32,
            state_root: subxt::utils::H256([8; 32usize]),
            extrinsics_root: subxt::utils::H256([8; 32usize]),
            digest: runtime_types::sp_runtime::generic::digest::Digest {
                logs: vec![
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],),
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],),
                    runtime_types::sp_runtime::generic::digest::DigestItem::PreRuntime([8;
                    4usize], vec![8, 8, 8],)
                ],
            },
            __subxt_unused_type_params: ::core::marker::PhantomData,
        },
    };
    let key_owner_proof: runtime_types::sp_consensus_babe::OpaqueKeyOwnershipProof = runtime_types::sp_consensus_babe::OpaqueKeyOwnershipProof(
        vec![8, 8, 8],
    );
    let runtime_api_call = runtime::apis()
        .babe_api()
        .submit_report_equivocation_unsigned_extrinsic(
            equivocation_proof,
            key_owner_proof,
        );
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<()> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let runtime_api_call = runtime::apis().authority_discovery_api().authorities();
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<runtime_types::sp_authority_discovery::app::Public> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let seed: Option<Vec<u8>> = None;
    let runtime_api_call = runtime::apis().session_keys().generate_session_keys(seed);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Vec<u8> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let encoded: Vec<u8> = vec![8, 8, 8];
    let runtime_api_call = runtime::apis().session_keys().decode_session_keys(encoded);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: Option<Vec<(Vec<u8>, runtime_types::sp_core::crypto::KeyTypeId)>> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let account: subxt::utils::AccountId32 = dev::bob().public_key().into();
    let runtime_api_call = runtime::apis().account_nonce_api().account_nonce(account);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: u32 = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let uxt: subxt::utils::UncheckedExtrinsic<
        subxt::utils::MultiAddress<subxt::utils::AccountId32, ()>,
        runtime_types::polkadot_runtime::RuntimeCall,
        runtime_types::sp_runtime::MultiSignature,
        (
            runtime_types::frame_system::extensions::check_non_zero_sender::CheckNonZeroSender,
            runtime_types::frame_system::extensions::check_spec_version::CheckSpecVersion,
            runtime_types::frame_system::extensions::check_tx_version::CheckTxVersion,
            runtime_types::frame_system::extensions::check_genesis::CheckGenesis,
            runtime_types::frame_system::extensions::check_mortality::CheckMortality,
            runtime_types::frame_system::extensions::check_nonce::CheckNonce,
            runtime_types::frame_system::extensions::check_weight::CheckWeight,
            runtime_types::pallet_transaction_payment::ChargeTransactionPayment,
            runtime_types::polkadot_runtime_common::claims::PrevalidateAttests,
        ),
    > = subxt::utils::UncheckedExtrinsic::new(vec![1, 2, 3, 4]);
    let len: u32 = 32;
    let runtime_api_call = runtime::apis()
        .transaction_payment_api()
        .query_info(uxt, len);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::pallet_transaction_payment::types::RuntimeDispatchInfo<
        u128,
        runtime_types::sp_weights::weight_v2::Weight,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let uxt: subxt::utils::UncheckedExtrinsic<
        subxt::utils::MultiAddress<subxt::utils::AccountId32, ()>,
        runtime_types::polkadot_runtime::RuntimeCall,
        runtime_types::sp_runtime::MultiSignature,
        (
            runtime_types::frame_system::extensions::check_non_zero_sender::CheckNonZeroSender,
            runtime_types::frame_system::extensions::check_spec_version::CheckSpecVersion,
            runtime_types::frame_system::extensions::check_tx_version::CheckTxVersion,
            runtime_types::frame_system::extensions::check_genesis::CheckGenesis,
            runtime_types::frame_system::extensions::check_mortality::CheckMortality,
            runtime_types::frame_system::extensions::check_nonce::CheckNonce,
            runtime_types::frame_system::extensions::check_weight::CheckWeight,
            runtime_types::pallet_transaction_payment::ChargeTransactionPayment,
            runtime_types::polkadot_runtime_common::claims::PrevalidateAttests,
        ),
    > = subxt::utils::UncheckedExtrinsic::new(vec![1, 2, 3, 4]);
    let len: u32 = 32;
    let runtime_api_call = runtime::apis()
        .transaction_payment_api()
        .query_fee_details(uxt, len);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::pallet_transaction_payment::types::FeeDetails<u128> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let weight: runtime_types::sp_weights::weight_v2::Weight = runtime_types::sp_weights::weight_v2::Weight {
        ref_time: 64,
        proof_size: 64,
    };
    let runtime_api_call = runtime::apis()
        .transaction_payment_api()
        .query_weight_to_fee(weight);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: u128 = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let length: u32 = 32;
    let runtime_api_call = runtime::apis()
        .transaction_payment_api()
        .query_length_to_fee(length);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: u128 = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let call: runtime_types::polkadot_runtime::RuntimeCall = runtime_types::polkadot_runtime::RuntimeCall::System(runtime_types::frame_system::pallet::Call::remark {
        remark: vec![8, 8, 8],
    });
    let len: u32 = 32;
    let runtime_api_call = runtime::apis()
        .transaction_payment_call_api()
        .query_call_info(call, len);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::pallet_transaction_payment::types::RuntimeDispatchInfo<
        u128,
        runtime_types::sp_weights::weight_v2::Weight,
    > = api.runtime_api().at_latest().await?.call(runtime_api_call).await?;
    let call: runtime_types::polkadot_runtime::RuntimeCall = runtime_types::polkadot_runtime::RuntimeCall::System(runtime_types::frame_system::pallet::Call::remark {
        remark: vec![8, 8, 8],
    });
    let len: u32 = 32;
    let runtime_api_call = runtime::apis()
        .transaction_payment_call_api()
        .query_call_fee_details(call, len);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: runtime_types::pallet_transaction_payment::types::FeeDetails<u128> = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let weight: runtime_types::sp_weights::weight_v2::Weight = runtime_types::sp_weights::weight_v2::Weight {
        ref_time: 64,
        proof_size: 64,
    };
    let runtime_api_call = runtime::apis()
        .transaction_payment_call_api()
        .query_weight_to_fee(weight);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: u128 = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    let length: u32 = 32;
    let runtime_api_call = runtime::apis()
        .transaction_payment_call_api()
        .query_length_to_fee(length);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let result: u128 = api
        .runtime_api()
        .at_latest()
        .await?
        .call(runtime_api_call)
        .await?;
    Ok(())
}
