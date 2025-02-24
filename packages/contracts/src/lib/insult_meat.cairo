
//*
//*
//* MeaCulpa (mc) 2024 lbdl | itrainspiders
//*

//! handle bad commands and idiocy, basicly take an err code and then
// generate some text output which we can pass back to the caller

pub mod insulter {
    use the_oruggin_trail::constants::zrk_constants::{ErrCode as ec};

    /// We opine on errors!
    /// 
    /// generates an output string for error handling
    ///  doesnt have any randomness as yet but needs it
   pub fn opine_on_errors(err: ec, cmd: @Array<ByteArray>) -> ByteArray {
      match err {
        ec::BadLen => { "Whoa, slow down pilgrim. Enunciate... less noise... more signal" },
        ec::BadFood => { "Nope ..., errm .... just no, it makes no sense at all" },
        _ => { "impl me" },
      } 
    }

}