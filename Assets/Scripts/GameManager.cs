using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public GameObject levelwon;
    public GameObject levelLost;
    
    bool controlBool = false;

    

public void LevelWon()

 {

    controlBool=true;
    levelwon.SetActive(true);
    Debug.Log("game Won");
    FindObjectOfType<SoundEffects>().WonSound();


 }

public void LevelLost()

 {
   if(controlBool == false){
 
    levelLost.SetActive(true);
    Debug.Log("level los12t ");
    FindObjectOfType<SoundEffects>().DeathSound();
 

       }
 }
}
