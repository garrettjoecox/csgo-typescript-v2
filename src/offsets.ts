import * as request from 'request';
import { MemoryTypes } from './process/process.interfaces';

export const getOffsets = async (): Promise<typeof localOffsets> => {
  const url = 'https://raw.githubusercontent.com/frk1/hazedumper/master/csgo.json';

  return new Promise((res, rej) => {
    request(
      {
        url,
        json: true,
      },
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          res(body);
        } else {
          rej(error);
        }
      }
    );
  });
};

// This is only here for typing
const localOffsets = {
  timestamp: 1608284679,
  signatures: {
    anim_overlays: 10624,
    clientstate_choked_commands: 19760,
    clientstate_delta_ticks: 372,
    clientstate_last_outgoing_command: 19756,
    clientstate_net_channel: 156,
    convar_name_hash_table: 192760,
    dwClientState: 5828580,
    dwClientState_GetLocalPlayer: 384,
    dwClientState_IsHLTV: 19784,
    dwClientState_Map: 652,
    dwClientState_MapDirectory: 392,
    dwClientState_MaxPlayer: 904,
    dwClientState_PlayerInfo: 21184,
    dwClientState_State: 264,
    dwClientState_ViewAngles: 19856,
    dwEntityList: 81394644,
    dwForceAttack: 52236596,
    dwForceAttack2: 52236608,
    dwForceBackward: 52236680,
    dwForceForward: 52236692,
    dwForceJump: 86285108,
    dwForceLeft: 52236560,
    dwForceRight: 52236548,
    dwGameDir: 6477816,
    dwGameRulesProxy: 86756908,
    dwGetAllClasses: 14351732,
    dwGlobalVars: 5827816,
    dwGlowObjectManager: 86933936,
    dwInput: 85922232,
    dwInterfaceLinkList: 9714772,
    dwLocalPlayer: 14189244,
    dwMouseEnable: 14212704,
    dwMouseEnablePtr: 14212656,
    dwPlayerResource: 52229264,
    dwRadarBase: 85805388,
    dwSensitivity: 14212348,
    dwSensitivityPtr: 14212304,
    dwSetClanTag: 565664,
    dwViewMatrix: 81335508,
    dwWeaponTable: 85924984,
    dwWeaponTableIndex: 12892,
    dwYawPtr: 14211776,
    dwZoomSensitivityRatioPtr: 14232928,
    dwbSendPackets: 881210,
    dwppDirect3DDevice9: 684112,
    find_hud_element: 668921472,
    force_update_spectator_glow: 3858930,
    interface_engine_cvar: 256492,
    is_c4_owner: 3910832,
    m_bDormant: 237,
    m_flSpawnTime: 41840,
    m_pStudioHdr: 10572,
    m_pitchClassPtr: 85806056,
    m_yawClassPtr: 14211776,
    model_ambient_min: 5840988,
    set_abs_angles: 1967536,
    set_abs_origin: 1967088,
  },
  netvars: {
    cs_gamerules_data: 0,
    m_ArmorValue: 45944,
    m_Collision: 800,
    m_CollisionGroup: 1140,
    m_Local: 12220,
    m_MoveType: 604,
    m_OriginalOwnerXuidHigh: 12740,
    m_OriginalOwnerXuidLow: 12736,
    m_SurvivalGameRuleDecisionTypes: 4904,
    m_SurvivalRules: 3328,
    m_aimPunchAngle: 12332,
    m_aimPunchAngleVel: 12344,
    m_angEyeAnglesX: 45948,
    m_angEyeAnglesY: 45952,
    m_bBombPlanted: 2469,
    m_bFreezePeriod: 32,
    m_bGunGameImmunity: 14660,
    m_bHasDefuser: 45960,
    m_bHasHelmet: 45932,
    m_bInReload: 12965,
    m_bIsDefusing: 14640,
    m_bIsQueuedMatchmaking: 116,
    m_bIsScoped: 14632,
    m_bIsValveDS: 124,
    m_bSpotted: 2365,
    m_bSpottedByMask: 2432,
    m_bStartedArming: 13296,
    m_bUseCustomAutoExposureMax: 2521,
    m_bUseCustomAutoExposureMin: 2520,
    m_bUseCustomBloomScale: 2522,
    m_clrRender: 112,
    m_dwBoneMatrix: 9896,
    m_fAccuracyPenalty: 13104,
    m_fFlags: 260,
    m_flC4Blow: 10640,
    m_flCustomAutoExposureMax: 2528,
    m_flCustomAutoExposureMin: 2524,
    m_flCustomBloomScale: 2532,
    m_flDefuseCountDown: 10668,
    m_flDefuseLength: 10664,
    m_flFallbackWear: 12752,
    m_flFlashDuration: 42016,
    m_flFlashMaxAlpha: 42012,
    m_flLastBoneSetupTime: 10532,
    m_flLowerBodyYawTarget: 14992,
    m_flNextAttack: 11632,
    m_flNextPrimaryAttack: 12856,
    m_flSimulationTime: 616,
    m_flTimerLength: 10644,
    m_hActiveWeapon: 12024,
    m_hMyWeapons: 11768,
    m_hObserverTarget: 13196,
    m_hOwner: 10700,
    m_hOwnerEntity: 332,
    m_iAccountID: 12232,
    m_iClip1: 12900,
    m_iCompetitiveRanking: 6788,
    m_iCompetitiveWins: 7048,
    m_iCrosshairId: 46052,
    m_iEntityQuality: 12204,
    m_iFOV: 12772,
    m_iFOVStart: 12776,
    m_iGlowIndex: 42040,
    m_iHealth: 256,
    m_iItemDefinitionIndex: 12202,
    m_iItemIDHigh: 12224,
    m_iMostRecentModelBoneCounter: 9872,
    m_iObserverMode: 13176,
    m_iShotsFired: 41872,
    m_iState: 12888,
    m_iTeamNum: 244,
    m_lifeState: 607,
    m_nFallbackPaintKit: 12744,
    m_nFallbackSeed: 12748,
    m_nFallbackStatTrak: 12756,
    m_nForceBone: 9868,
    m_nTickBase: 13360,
    m_rgflCoordinateFrame: 1092,
    m_szCustomName: 12348,
    m_szLastPlaceName: 13748,
    m_thirdPersonViewAngles: 12760,
    m_vecOrigin: 312,
    m_vecVelocity: 276,
    m_vecViewOffset: 264,
    m_viewPunchAngle: 12320,
  },
};

export interface Signatures {
  anim_overlays: number;
  clientstate_choked_commands: number;
  clientstate_delta_ticks: number;
  clientstate_last_outgoing_command: number;
  clientstate_net_channel: number;
  convar_name_hash_table: number;
  dwClientState: number;
  dwClientState_GetLocalPlayer: number;
  dwClientState_IsHLTV: number;
  dwClientState_Map: number;
  dwClientState_MapDirectory: number;
  dwClientState_MaxPlayer: number;
  dwClientState_PlayerInfo: number;
  dwClientState_State: number;
  dwClientState_ViewAngles: number;
  dwEntityList: number;
  dwForceAttack: number;
  dwForceAttack2: number;
  dwForceBackward: number;
  dwForceForward: number;
  dwForceJump: number;
  dwForceLeft: number;
  dwForceRight: number;
  dwGameDir: number;
  dwGameRulesProxy: number;
  dwGetAllClasses: number;
  dwGlobalVars: number;
  dwGlowObjectManager: number;
  dwInput: number;
  dwInterfaceLinkList: number;
  dwLocalPlayer: number;
  dwMouseEnable: number;
  dwMouseEnablePtr: number;
  dwPlayerResource: number;
  dwRadarBase: number;
  dwSensitivity: number;
  dwSensitivityPtr: number;
  dwSetClanTag: number;
  dwViewMatrix: number;
  dwWeaponTable: number;
  dwWeaponTableIndex: number;
  dwYawPtr: number;
  dwZoomSensitivityRatioPtr: number;
  dwbSendPackets: number;
  dwppDirect3DDevice9: number;
  find_hud_element: number;
  force_update_spectator_glow: number;
  interface_engine_cvar: number;
  is_c4_owner: number;
  m_bDormant: number;
  m_flSpawnTime: number;
  m_pStudioHdr: number;
  m_pitchClassPtr: number;
  m_yawClassPtr: number;
  model_ambient_min: number;
  set_abs_angles: number;
  set_abs_origin: number;
}

export interface Netvars {
  cs_gamerules_data: number;
  m_ArmorValue: number;
  m_Collision: number;
  m_CollisionGroup: number;
  m_Local: number;
  m_MoveType: number;
  m_OriginalOwnerXuidHigh: number;
  m_OriginalOwnerXuidLow: number;
  m_SurvivalGameRuleDecisionTypes: number;
  m_SurvivalRules: number;
  m_aimPunchAngle: number;
  m_aimPunchAngleVel: number;
  m_angEyeAnglesX: number;
  m_angEyeAnglesY: number;
  m_bBombPlanted: number;
  m_bFreezePeriod: number;
  m_bGunGameImmunity: number;
  m_bHasDefuser: number;
  m_bHasHelmet: number;
  m_bInReload: number;
  m_bIsDefusing: number;
  m_bIsQueuedMatchmaking: number;
  m_bIsScoped: number;
  m_bIsValveDS: number;
  m_bSpotted: number;
  m_bSpottedByMask: number;
  m_bStartedArming: number;
  m_bUseCustomAutoExposureMax: number;
  m_bUseCustomAutoExposureMin: number;
  m_bUseCustomBloomScale: number;
  m_clrRender: number;
  m_dwBoneMatrix: number;
  m_fAccuracyPenalty: number;
  m_fFlags: number;
  m_flC4Blow: number;
  m_flCustomAutoExposureMax: number;
  m_flCustomAutoExposureMin: number;
  m_flCustomBloomScale: number;
  m_flDefuseCountDown: number;
  m_flDefuseLength: number;
  m_flFallbackWear: number;
  m_flFlashDuration: number;
  m_flFlashMaxAlpha: number;
  m_flLastBoneSetupTime: number;
  m_flLowerBodyYawTarget: number;
  m_flNextAttack: number;
  m_flNextPrimaryAttack: number;
  m_flSimulationTime: number;
  m_flTimerLength: number;
  m_hActiveWeapon: number;
  m_hMyWeapons: number;
  m_hObserverTarget: number;
  m_hOwner: number;
  m_hOwnerEntity: number;
  m_iAccountID: number;
  m_iClip1: number;
  m_iCompetitiveRanking: number;
  m_iCompetitiveWins: number;
  m_iCrosshairId: number;
  m_iEntityQuality: number;
  m_iFOV: number;
  m_iFOVStart: number;
  m_iGlowIndex: number;
  m_iHealth: number;
  m_iItemDefinitionIndex: number;
  m_iItemIDHigh: number;
  m_iMostRecentModelBoneCounter: number;
  m_iObserverMode: number;
  m_iShotsFired: number;
  m_iState: number;
  m_iTeamNum: number;
  m_lifeState: number;
  m_nFallbackPaintKit: number;
  m_nFallbackSeed: number;
  m_nFallbackStatTrak: number;
  m_nForceBone: number;
  m_nTickBase: number;
  m_rgflCoordinateFrame: number;
  m_szCustomName: number;
  m_szLastPlaceName: number;
  m_thirdPersonViewAngles: number;
  m_vecOrigin: number;
  m_vecVelocity: number;
  m_vecViewOffset: number;
  m_viewPunchAngle: number;
}

export const MemoryTypesForNetvars = {
  cs_gamerules_data: MemoryTypes.vector3,
  m_ArmorValue: MemoryTypes.vector3,
  m_Collision: MemoryTypes.vector3,
  m_CollisionGroup: MemoryTypes.vector3,
  m_Local: MemoryTypes.vector3,
  m_MoveType: MemoryTypes.vector3,
  m_OriginalOwnerXuidHigh: MemoryTypes.vector3,
  m_OriginalOwnerXuidLow: MemoryTypes.vector3,
  m_SurvivalGameRuleDecisionTypes: MemoryTypes.vector3,
  m_SurvivalRules: MemoryTypes.vector3,
  m_aimPunchAngle: MemoryTypes.vector3,
  m_aimPunchAngleVel: MemoryTypes.vector3,
  m_angEyeAnglesX: MemoryTypes.float,
  m_angEyeAnglesY: MemoryTypes.float,
  m_bBombPlanted: MemoryTypes.boolean,
  m_bFreezePeriod: MemoryTypes.int32,
  m_bGunGameImmunity: MemoryTypes.vector3,
  m_bHasDefuser: MemoryTypes.boolean,
  m_bHasHelmet: MemoryTypes.boolean,
  m_bInReload: MemoryTypes.boolean,
  m_bIsDefusing: MemoryTypes.boolean,
  m_bIsQueuedMatchmaking: MemoryTypes.boolean,
  m_bIsScoped: MemoryTypes.boolean,
  m_bIsValveDS: MemoryTypes.boolean,
  m_bSpotted: MemoryTypes.boolean,
  m_bSpottedByMask: MemoryTypes.boolean,
  m_bStartedArming: MemoryTypes.boolean,
  m_bUseCustomAutoExposureMax: MemoryTypes.boolean,
  m_bUseCustomAutoExposureMin: MemoryTypes.boolean,
  m_bUseCustomBloomScale: MemoryTypes.boolean,
  m_clrRender: MemoryTypes.vector3,
  m_dwBoneMatrix: MemoryTypes.dword,
  m_fAccuracyPenalty: MemoryTypes.float,
  m_fFlags: MemoryTypes.float,
  m_flC4Blow: MemoryTypes.float,
  m_flCustomAutoExposureMax: MemoryTypes.float,
  m_flCustomAutoExposureMin: MemoryTypes.float,
  m_flCustomBloomScale: MemoryTypes.float,
  m_flDefuseCountDown: MemoryTypes.float,
  m_flDefuseLength: MemoryTypes.float,
  m_flFallbackWear: MemoryTypes.float,
  m_flFlashDuration: MemoryTypes.float,
  m_flFlashMaxAlpha: MemoryTypes.float,
  m_flLastBoneSetupTime: MemoryTypes.float,
  m_flLowerBodyYawTarget: MemoryTypes.float,
  m_flNextAttack: MemoryTypes.float,
  m_flNextPrimaryAttack: MemoryTypes.float,
  m_flSimulationTime: MemoryTypes.float,
  m_flTimerLength: MemoryTypes.float,
  m_hActiveWeapon: MemoryTypes.dword,
  m_hMyWeapons: MemoryTypes.dword,
  m_hObserverTarget: MemoryTypes.dword,
  m_hOwner: MemoryTypes.dword,
  m_hOwnerEntity: MemoryTypes.dword,
  m_iAccountID: MemoryTypes.int,
  m_iClip1: MemoryTypes.int,
  m_iCompetitiveRanking: MemoryTypes.int,
  m_iCompetitiveWins: MemoryTypes.int,
  m_iCrosshairId: MemoryTypes.int,
  m_iEntityQuality: MemoryTypes.int,
  m_iFOV: MemoryTypes.int,
  m_iFOVStart: MemoryTypes.int,
  m_iGlowIndex: MemoryTypes.int,
  m_iHealth: MemoryTypes.int,
  m_iItemDefinitionIndex: MemoryTypes.int,
  m_iItemIDHigh: MemoryTypes.int,
  m_iMostRecentModelBoneCounter: MemoryTypes.int,
  m_iObserverMode: MemoryTypes.int,
  m_iShotsFired: MemoryTypes.int,
  m_iState: MemoryTypes.int,
  m_iTeamNum: MemoryTypes.int,
  m_lifeState: MemoryTypes.int,
  m_nFallbackPaintKit: MemoryTypes.vector3,
  m_nFallbackSeed: MemoryTypes.vector3,
  m_nFallbackStatTrak: MemoryTypes.vector3,
  m_nForceBone: MemoryTypes.vector3,
  m_nTickBase: MemoryTypes.vector3,
  m_rgflCoordinateFrame: MemoryTypes.vector3,
  m_szCustomName: MemoryTypes.vector3,
  m_szLastPlaceName: MemoryTypes.vector3,
  m_thirdPersonViewAngles: MemoryTypes.vector3,
  m_vecOrigin: MemoryTypes.vector3,
  m_vecVelocity: MemoryTypes.vector3,
  m_vecViewOffset: MemoryTypes.vector3,
  m_viewPunchAngle: MemoryTypes.vector3,
};

export const MemoryTypesForSignatures = {
  anim_overlays: MemoryTypes.dword,
  clientstate_choked_commands: MemoryTypes.dword,
  clientstate_delta_ticks: MemoryTypes.dword,
  clientstate_last_outgoing_command: MemoryTypes.dword,
  clientstate_net_channel: MemoryTypes.dword,
  convar_name_hash_table: MemoryTypes.dword,
  dwClientState: MemoryTypes.dword,
  dwClientState_GetLocalPlayer: MemoryTypes.int,
  dwClientState_IsHLTV: MemoryTypes.boolean,
  dwClientState_Map: MemoryTypes.string,
  dwClientState_MapDirectory: MemoryTypes.string,
  dwClientState_MaxPlayer: MemoryTypes.int,
  dwClientState_PlayerInfo: MemoryTypes.dword,
  dwClientState_State: MemoryTypes.dword,
  dwClientState_ViewAngles: MemoryTypes.vector3,
  dwEntityList: MemoryTypes.dword,
  dwForceAttack: MemoryTypes.dword,
  dwForceAttack2: MemoryTypes.dword,
  dwForceBackward: MemoryTypes.dword,
  dwForceForward: MemoryTypes.dword,
  dwForceJump: MemoryTypes.dword,
  dwForceLeft: MemoryTypes.dword,
  dwForceRight: MemoryTypes.dword,
  dwGameDir: MemoryTypes.dword,
  dwGameRulesProxy: MemoryTypes.dword,
  dwGetAllClasses: MemoryTypes.dword,
  dwGlobalVars: MemoryTypes.dword,
  dwGlowObjectManager: MemoryTypes.dword,
  dwInput: MemoryTypes.dword,
  dwInterfaceLinkList: MemoryTypes.dword,
  dwLocalPlayer: MemoryTypes.dword,
  dwMouseEnable: MemoryTypes.dword,
  dwMouseEnablePtr: MemoryTypes.dword,
  dwPlayerResource: MemoryTypes.dword,
  dwRadarBase: MemoryTypes.dword,
  dwSensitivity: MemoryTypes.dword,
  dwSensitivityPtr: MemoryTypes.dword,
  dwSetClanTag: MemoryTypes.dword,
  dwViewMatrix: MemoryTypes.dword,
  dwWeaponTable: MemoryTypes.dword,
  dwWeaponTableIndex: MemoryTypes.dword,
  dwYawPtr: MemoryTypes.dword,
  dwZoomSensitivityRatioPtr: MemoryTypes.dword,
  dwbSendPackets: MemoryTypes.dword,
  dwppDirect3DDevice9: MemoryTypes.dword,
  find_hud_element: MemoryTypes.dword,
  force_update_spectator_glow: MemoryTypes.dword,
  interface_engine_cvar: MemoryTypes.dword,
  is_c4_owner: MemoryTypes.dword,
  m_bDormant: MemoryTypes.dword,
  m_flSpawnTime: MemoryTypes.dword,
  m_pStudioHdr: MemoryTypes.dword,
  m_pitchClassPtr: MemoryTypes.dword,
  m_yawClassPtr: MemoryTypes.dword,
  model_ambient_min: MemoryTypes.dword,
  set_abs_angles: MemoryTypes.dword,
  set_abs_origin: MemoryTypes.dword,
};

export interface OffsetCollection {
  timestamp: number;
  signatures: Signatures;
  netvars: Netvars;
}
